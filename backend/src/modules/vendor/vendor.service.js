const { getPagination, getPaginationMeta } = require("../../utils/pagination");
const buildFilters = require("../../utils/filter");
const db = require("../../config/db");


/* ===============================
   GET VENDORS
================================= */

const getVendors = async (queryParams) => {

  const { page, limit, skip } = getPagination(queryParams);

  const filters = buildFilters(queryParams, [
    "business_name",
    "email",
    "mobile"
  ]);

  let where = [];
  let values = [];

  /* STATUS FILTER */
  if (filters.status) {
    where.push("v.status = ?");
    values.push(filters.status);
  }

  /* TIER FILTER */
  if (filters.tier) {
    where.push("v.tier = ?");
    values.push(filters.tier);
  }

  /* SEARCH FILTER */
  if (filters.$or) {

    const searchConditions = filters.$or.map(condition => {

      const key = Object.keys(condition)[0];
      const value = condition[key].$regex;

      values.push(`%${value}%`);

      return `v.${key} LIKE ?`;

    });

    where.push(`(${searchConditions.join(" OR ")})`);

  }

  const whereClause = where.length
    ? `WHERE ${where.join(" AND ")}`
    : "";

  /* GET RECORDS */

  const [records] = await db.query(
    `
    SELECT
      v.*,
      vf.profile_photo
    FROM vendors v
    LEFT JOIN vendor_files vf
      ON v.id = vf.vendor_id
    ${whereClause}
    ORDER BY v.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...values, limit, skip]
  );

  /* TOTAL COUNT */

  const [countResult] = await db.query(
    `SELECT COUNT(*) as total FROM vendors v ${whereClause}`,
    values
  );

  const totalRecords = countResult[0].total;

  const pagination = getPaginationMeta(page, limit, totalRecords);

  const formattedRecords = records.map(vendor => ({

    id: vendor.id,

    businessName: vendor.business_name,
    fullName: vendor.full_name,
    email: vendor.email,

    countryCode: vendor.country_code,
    mobile: vendor.mobile,

    contactNo: `${vendor.country_code} ${vendor.mobile}`,

    category: vendor.category
      ? JSON.parse(vendor.category)
      : [],

    address: vendor.address,
    city: vendor.city,
    state: vendor.state,
    country: vendor.country,
    pincode: vendor.pincode,

    fullAddress: `${vendor.address}, ${vendor.city}, ${vendor.state}`,

    tier: vendor.tier,
    expectedTurnover: vendor.expected_turnover,

    status: vendor.status,

    profilePhoto: vendor.profile_photo,

    createdAt: vendor.created_at

  }));


  /* STATS */

  const [stats] = await db.query(`
    SELECT
      COUNT(*) as total,
      SUM(status='Active') as active,
      SUM(status='Inactive') as inactive,
      COUNT(DISTINCT tier) as tiers
    FROM vendors
  `);

  return {
    stats: stats[0],
    records: formattedRecords,
    pagination
  };

};


/* ===============================
   GET VENDOR BY ID
================================= */

const getVendorById = async (id) => {

  const [rows] = await db.query(
    `
    SELECT
      v.*,
      vf.*
    FROM vendors v
    LEFT JOIN vendor_files vf
      ON v.id = vf.vendor_id
    WHERE v.id = ?
    `,
    [id]
  );

  return rows[0] || null;

};


/* ===============================
   CREATE VENDOR
================================= */

const createVendor = async (data) => {

  /* EMAIL CHECK */

  const [emailExists] = await db.execute(
    "SELECT id FROM vendors WHERE email = ?",
    [data.email]
  );

  if (emailExists.length) {
    throw new Error("Email already exists");
  }

  /* MOBILE CHECK */

  const [mobileExists] = await db.execute(
    "SELECT id FROM vendors WHERE mobile = ?",
    [data.mobile]
  );

  if (mobileExists.length) {
    throw new Error("Mobile number already exists");
  }

  /* INSERT VENDOR */

  const vendorQuery = `
    INSERT INTO vendors (
      business_name,
      full_name,
      email,
      country_code,
      mobile,
      category,
      address,
      city,
      state,
      country,
      pincode,
      tier,
      expected_turnover,
      status
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const vendorValues = [

    data.businessName,
    data.fullName,
    data.email,

    data.countryCode,
    data.mobile,

    JSON.stringify(data.category || []),

    data.address,
    data.city,
    data.state,
    data.country,
    data.pincode,

    data.tier,
    data.expectedTurnover,

    data.status || "Active"

  ];

  const [vendorResult] = await db.execute(
    vendorQuery,
    vendorValues
  );

  const vendorId = vendorResult.insertId;

  /* INSERT FILES */

  const files = data.files || {};

  await db.execute(
    `
    INSERT INTO vendor_files (
      vendor_id,
      profile_photo,
      profile_photo_key,
      aadhar_doc,
      aadhar_doc_key,
      pan_doc,
      pan_doc_key,
      license_doc,
      license_doc_key,
      fassi_doc,
      fassi_doc_key,
      gst_doc,
      gst_doc_key
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      vendorId,

      files.profilePhoto || null,
      files.profilePhotoKey || null,

      files.aadharDoc || null,
      files.aadharDocKey || null,

      files.panDoc || null,
      files.panDocKey || null,

      files.licenseDoc || null,
      files.licenseDocKey || null,

      files.fassiDoc || null,
      files.fassiDocKey || null,

      files.gstDoc || null,
      files.gstDocKey || null
    ]
  );

  return {
    id: vendorId,
    businessName: data.businessName,
    email: data.email,
    mobile: data.mobile
  };

};


/* ===============================
   UPDATE VENDOR
================================= */

const updateVendor = async (id, data) => {

  const query = `
  UPDATE vendors
  SET
    business_name = ?,
    full_name = ?,
    email = ?,
    country_code = ?,
    mobile = ?,
    category = ?,
    address = ?,
    city = ?,
    state = ?,
    country = ?,
    pincode = ?,
    tier = ?,
    expected_turnover = ?,
    status = ?
  WHERE id = ?
  `;

  const values = [

    data.businessName,
    data.fullName,
    data.email,

    data.countryCode,
    data.mobile,

    JSON.stringify(data.category || []),

    data.address,
    data.city,
    data.state,
    data.country,
    data.pincode,

    data.tier,
    data.expectedTurnover,
    data.status,

    id
  ];

  await db.execute(query, values);

  return {
    id,
    businessName: data.businessName,
    email: data.email
  };

};


/* ===============================
   TOGGLE STATUS
================================= */

const toggleStatus = async (id) => {

  const [rows] = await db.query(
    "SELECT id, status FROM vendors WHERE id = ?",
    [id]
  );

  if (!rows.length) return null;

  const vendor = rows[0];

  const newStatus =
    vendor.status === "Active"
      ? "Inactive"
      : "Active";

  await db.query(
    "UPDATE vendors SET status = ? WHERE id = ?",
    [newStatus, id]
  );

  const [updated] = await db.query(
    "SELECT * FROM vendors WHERE id = ?",
    [id]
  );

  return updated[0];

};


/* ===============================
   DELETE VENDOR
================================= */

const deleteVendor = async (id) => {

  const [rows] = await db.query(
    "SELECT id, status FROM vendors WHERE id = ?",
    [id]
  );

  if (!rows.length) {
    return { error: "Vendor not found" };
  }

  const vendor = rows[0];

  if (vendor.status === "Active") {
    return { error: "Vendor is active. Please deactivate first." };
  }

  await db.query(
    "DELETE FROM vendor_files WHERE vendor_id = ?",
    [id]
  );

  await db.query(
    "DELETE FROM vendors WHERE id = ?",
    [id]
  );

  return { success: true };

};


/* ===============================
   EXPORTS
================================= */

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  toggleStatus,
  deleteVendor
};