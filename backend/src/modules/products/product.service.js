import db from "../../config/db.js";
import { getPagination, getPaginationMeta } from '../../utils/pagination.js';
import slugify from 'slugify';
import s3Service from '../../services/s3Service.js';
import { createProductSchema } from './product.validator.js';
import ApiError from '../../utils/ApiError.js';

const createProduct = async (data, files) => {
  // Handle JSON strings if from multipart
  if (typeof data.variants === 'string') data.variants = JSON.parse(data.variants);
  if (typeof data.specification === 'string') data.specification = JSON.parse(data.specification);
  if (typeof data.images === 'string') data.images = JSON.parse(data.images);

  // Validate request
  const { error } = createProductSchema.validate(data);
  if (error) {
    throw new ApiError(400, "Validation failed", "VALIDATION_ERROR", error.details[0].message);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      vendor_id, category_id, subcategory_id, brand_id, custom_brand,
      name, description, specification, country_of_origin,
      manufacture_date, expiry_date, return_allowed, return_days,
      variants, images
    } = data;

    // Fetch Vendor/Category info for S3 path and approval policy
    const [metaRows] = await connection.query(
      `SELECT v.business_name, v.auto_approve_products, c.name as category_name
       FROM vendors v, categories c 
       WHERE v.id = ? AND c.id = ?`,
      [vendor_id, category_id]
    );

    if (metaRows.length === 0) throw new Error("Vendor or Category not found");

    const vendorInfo = metaRows[0];
    const vendorSlug = slugify(vendorInfo.business_name, { lower: true });
    const categorySlug = slugify(vendorInfo.category_name, { lower: true });
    const productPathName = slugify(name, { lower: true });
    const s3Folder = `${vendorSlug}/${categorySlug}/${productPathName}`;

    // Handle S3 Uploads
    const uploadedImages = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const upload = await s3Service.uploadFile(files[i], s3Folder);
        uploadedImages.push({
          image_url: upload.url,
          is_primary: i === 0,
          sort_order: i
        });
      }
    }

    const finalImages = [...(images || []), ...uploadedImages];

    const autoApprove = vendorInfo.auto_approve_products === 1;
    const approvalStatus = autoApprove ? 'APPROVED' : 'PENDING';
    const productSlug = slugify(name, { lower: true }) + '-' + Date.now();

    // Insert into products table
    const [productResult] = await connection.query(
      `INSERT INTO products 
      (vendor_id, category_id, subcategory_id, brand_id, custom_brand, name, slug, description, specification,
       country_of_origin, manufacture_date, expiry_date, return_allowed, return_days, approval_status, is_live)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendor_id,
        category_id,
        subcategory_id,
        brand_id,
        custom_brand,
        name,
        productSlug,
        description,
        JSON.stringify(specification),
        country_of_origin,
        manufacture_date,
        expiry_date,
        return_allowed ? 1 : 0,
        return_days,
        approvalStatus,
        autoApprove ? 1 : 0
      ]
    );

    const productId = productResult.insertId;

    // Insert product variants
    for (const variant of variants) {
      await connection.query(
        `INSERT INTO product_variants
        (product_id, variant_name, unit, color, sku, mrp, sale_price, discount_value, discount_type, stock, min_order, low_stock_alert)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          variant.variant_name,
          variant.unit,
          variant.color,
          variant.sku,
          variant.mrp,
          variant.sale_price,
          variant.discount_value,
          variant.discount_type,
          variant.stock,
          variant.min_order,
          variant.low_stock_alert
        ]
      );
    }

    // Insert product images
    for (const image of finalImages) {
      await connection.query(
        `INSERT INTO product_images
        (product_id, image_url, is_primary, sort_order)
        VALUES (?, ?, ?, ?)`,
        [
          productId,
          image.image_url,
          image.is_primary,
          image.sort_order
        ]
      );
    }

    await connection.commit();
    return { product_id: productId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getAllProducts = async (queryParams) => {
  const { page, limit, skip } = getPagination(queryParams);

  let where = [];
  let values = [];

  // Filters
  if (queryParams.vendor_id) {
    where.push("p.vendor_id = ?");
    values.push(queryParams.vendor_id);
  }
  if (queryParams.category_id) {
    where.push("p.category_id = ?");
    values.push(queryParams.category_id);
  }
  if (queryParams.approval_status) {
    where.push("p.approval_status = ?");
    values.push(queryParams.approval_status);
  }
  if (queryParams.is_live !== undefined) {
    where.push("p.is_live = ?");
    values.push(queryParams.is_live === 'true' ? 1 : 0);
  }
  if (queryParams.search) {
    where.push("(p.name LIKE ? OR p.custom_brand LIKE ?)");
    const searchVal = `%${queryParams.search}%`;
    values.push(searchVal, searchVal);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // Total Count
  const [countResult] = await db.query(
    `SELECT COUNT(*) as total FROM products p ${whereClause}`,
    values
  );
  const totalRecords = countResult[0].total;

  // Fetch Products
  const selectQuery = `
    SELECT 
      p.*,
      v.business_name as vendor_name,
      c.name as category_name,
      sc.name as subcategory_name,
      b.name as brand_name
    FROM products p
    LEFT JOIN vendors v ON p.vendor_id = v.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    LEFT JOIN brands b ON p.brand_id = b.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(selectQuery, [...values, limit, skip]);

  if (rows.length > 0) {
    const productIds = rows.map(p => p.id);

    // Fetch primary images
    const [images] = await db.query(
      `SELECT * FROM product_images WHERE product_id IN (?) AND is_primary = 1`,
      [productIds]
    );
    const imagesMap = {};
    images.forEach(img => { imagesMap[img.product_id] = img.image_url; });

    // Fetch prices
    const [prices] = await db.query(
      `SELECT product_id, MIN(sale_price) as min_price, MIN(mrp) as min_mrp 
       FROM product_variants 
       WHERE product_id IN (?) 
       GROUP BY product_id`,
      [productIds]
    );
    const priceMap = {};
    prices.forEach(p => { 
      priceMap[p.product_id] = { min_price: p.min_price, min_mrp: p.min_mrp }; 
    });

    rows.forEach(p => {
      p.primary_image = imagesMap[p.id] || null;
      p.price_info = priceMap[p.id] || { min_price: 0, min_mrp: 0 };
    });
  }

  const pagination = getPaginationMeta(page, limit, totalRecords);

  // Stats
  const [statsResult] = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN approval_status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN approval_status = 'PENDING' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN approval_status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
    FROM products
  `);

  return {
    records: rows,
    pagination,
    stats: statsResult[0]
  };
};

export default {
  createProduct,
  getAllProducts
};
