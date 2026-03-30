import ApiResponse from '../../utils/apiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import productService from './product.service.js';

export const createProduct = asyncHandler(async (req, res) => {
  const result = await productService.createProduct(req.body, req.files);
  return ApiResponse.success(res, "Product created successfully", result);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  return ApiResponse.success(res, "Products fetched successfully", products);
});

export default { createProduct, getAllProducts };
