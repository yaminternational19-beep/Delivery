const ApiResponse = require("../../utils/apiResponse");
const service = require("./brand.service");

/* ===============================
   CREATE BRAND
================================= */

exports.createBrand = async (req, res) => {
  try {
    const brand = await service.createBrand(req.body, req.file);
    return ApiResponse.success(
      res,
      "Brand created successfully",
      brand
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || "Failed to create brand"
    );
  }
};


/* ===============================
   GET BRANDS
================================= */

exports.getBrands = async (req, res) => {
  try {
    const result = await service.getBrands(req.query);
    return ApiResponse.success(
      res,
      "Brands fetched successfully",
      result
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || "Failed to fetch brands"
    );
  }
};


/* ===============================
   UPDATE BRAND
================================= */

exports.updateBrand = async (req, res) => {
  try {
    const brand = await service.updateBrand(
      req.params.id,
      req.body,
      req.file
    );
    return ApiResponse.success(
      res,
      "Brand updated successfully",
      brand
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || "Failed to update brand"
    );

  }
};


/* ===============================
   DELETE BRAND
================================= */

exports.deleteBrand = async (req, res) => {
  try {
    const deleted = await service.deleteBrand(req.params.id);
    return ApiResponse.success(
      res,
      "Brand deleted successfully",
      deleted
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || "Failed to delete brand"
    );
  }
};


/* ===============================
   TOGGLE BRAND STATUS
================================= */

exports.toggleStatus = async (req, res) => {
  try {
    const data = await service.toggleStatus(
      req.params.id,
      req.body.status
    );
    return ApiResponse.success(
      res,
      "Brand status updated",
      data
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || "Failed to update brand status"
    );
  }
};