const ApiResponse = require("../../utils/apiResponse");
const service = require("./vendor.service");

const { uploadFile, deleteFile } = require("../../services/s3Service");

exports.getVendors = async (req, res) => {
  try {

    const result = await service.getVendors(req.query);

    return ApiResponse.success(
      res,
      "Vendors fetched successfully",
      result
    );

  } catch (err) {

    return ApiResponse.error(res, err.message);

  }
};


exports.getVendorById = async (req, res) => {
  try {

    const result = await service.getVendorById(req.params.id);

    if (!result) {
      return ApiResponse.error(res, "Vendor not found", 404);
    }

    return ApiResponse.success(
      res,
      "Vendor fetched successfully",
      result
    );

  } catch (err) {

    return ApiResponse.error(res, err.message);

  }
};


exports.createVendor = async (req, res) => {

  try {

    let filesPayload = {};

    /* profile photo */
    if (req.files?.profilePhoto) {

      const uploadResult = await uploadFile(
        req.files.profilePhoto[0],
        "vendors/profile"
      );

      filesPayload.profilePhoto = uploadResult.url;
      filesPayload.profilePhotoKey = uploadResult.key;
    }

    /* aadhar doc */
    if (req.files?.aadharDoc) {

      const uploadResult = await uploadFile(
        req.files.aadharDoc[0],
        "vendors/aadhar"
      );

      filesPayload.aadharDoc = uploadResult.url;
      filesPayload.aadharDocKey = uploadResult.key;
    }

    /* pan doc */
    if (req.files?.panDoc) {

      const uploadResult = await uploadFile(
        req.files.panDoc[0],
        "vendors/pan"
      );

      filesPayload.panDoc = uploadResult.url;
      filesPayload.panDocKey = uploadResult.key;
    }

    /* license doc */
    if (req.files?.licenseDoc) {

      const uploadResult = await uploadFile(
        req.files.licenseDoc[0],
        "vendors/license"
      );

      filesPayload.licenseDoc = uploadResult.url;
      filesPayload.licenseDocKey = uploadResult.key;
    }

    /* fssai doc */
    if (req.files?.fassiDoc) {

      const uploadResult = await uploadFile(
        req.files.fassiDoc[0],
        "vendors/fssai"
      );

      filesPayload.fassiDoc = uploadResult.url;
      filesPayload.fassiDocKey = uploadResult.key;
    }

    /* gst doc */
    if (req.files?.gstDoc) {

      const uploadResult = await uploadFile(
        req.files.gstDoc[0],
        "vendors/gst"
      );

      filesPayload.gstDoc = uploadResult.url;
      filesPayload.gstDocKey = uploadResult.key;
    }

    const payload = {
      ...req.body,
      files: filesPayload
    };

    const result = await service.createVendor(payload);

    return ApiResponse.success(
      res,
      "Vendor created successfully",
      result,
      201
    );

  } catch (err) {

    return ApiResponse.error(res, err.message);

  }

};


exports.updateVendor = async (req, res) => {

  try {

    const id = req.params.id;

    const existing = await service.getVendorById(id);

    if (!existing) {
      return ApiResponse.error(res, "Vendor not found", 404);
    }

    let filesPayload = {};

    /* profile photo update */
    if (req.files?.profilePhoto) {

      const uploadResult = await uploadFile(
        req.files.profilePhoto[0],
        "vendors/profile"
      );

      filesPayload.profilePhoto = uploadResult.url;
      filesPayload.profilePhotoKey = uploadResult.key;
    }

    /* aadhar update */
    if (req.files?.aadharDoc) {

      const uploadResult = await uploadFile(
        req.files.aadharDoc[0],
        "vendors/aadhar"
      );

      filesPayload.aadharDoc = uploadResult.url;
      filesPayload.aadharDocKey = uploadResult.key;
    }

    /* pan update */
    if (req.files?.panDoc) {

      const uploadResult = await uploadFile(
        req.files.panDoc[0],
        "vendors/pan"
      );

      filesPayload.panDoc = uploadResult.url;
      filesPayload.panDocKey = uploadResult.key;
    }

    /* license update */
    if (req.files?.licenseDoc) {

      const uploadResult = await uploadFile(
        req.files.licenseDoc[0],
        "vendors/license"
      );

      filesPayload.licenseDoc = uploadResult.url;
      filesPayload.licenseDocKey = uploadResult.key;
    }

    /* fssai update */
    if (req.files?.fassiDoc) {

      const uploadResult = await uploadFile(
        req.files.fassiDoc[0],
        "vendors/fssai"
      );

      filesPayload.fassiDoc = uploadResult.url;
      filesPayload.fassiDocKey = uploadResult.key;
    }

    /* gst update */
    if (req.files?.gstDoc) {

      const uploadResult = await uploadFile(
        req.files.gstDoc[0],
        "vendors/gst"
      );

      filesPayload.gstDoc = uploadResult.url;
      filesPayload.gstDocKey = uploadResult.key;
    }

    const payload = {
      ...req.body,
      files: filesPayload
    };

    const result = await service.updateVendor(id, payload);

    return ApiResponse.success(
      res,
      "Vendor updated successfully",
      result
    );

  } catch (err) {

    return ApiResponse.error(res, err.message);

  }

};


exports.toggleStatus = async (req, res) => {

  try {

    const result = await service.toggleStatus(req.params.id);

    if (!result) {
      return ApiResponse.error(res, "Vendor not found", 404);
    }

    return ApiResponse.success(
      res,
      "Vendor status updated",
      result
    );

  } catch (err) {

    return ApiResponse.error(res, err.message);

  }

};


exports.deleteVendor = async (req, res) => {

  try {

    const result = await service.deleteVendor(req.params.id);

    if (!result) {
      return ApiResponse.error(res, "Vendor not found", 404);
    }

    return ApiResponse.success(
      res,
      "Vendor deleted successfully"
    );

  } catch (err) {

    return ApiResponse.error(res, err.message);

  }

};