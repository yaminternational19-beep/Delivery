const express = require("express");
const router = express.Router();

const controller = require("./vendor.controller");

const {
  createVendorSchema,
  updateVendorSchema
} = require("./vendor.validator");

const upload = require("../../middlewares/upload.middleware.js");
const validate = require("../../middlewares/validate");


/* ===============================
   GET VENDORS
================================= */
router.get("/", controller.getVendors);


/* ===============================
   GET SINGLE VENDOR
================================= */
router.get("/:id", controller.getVendorById);


/* ===============================
   CREATE VENDOR
================================= */
router.post(
  "/",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
    { name: "licenseDoc", maxCount: 1 },
    { name: "fassiDoc", maxCount: 1 },
    { name: "gstDoc", maxCount: 1 }
  ]),
  validate(createVendorSchema),
  controller.createVendor
);


/* ===============================
   UPDATE VENDOR
================================= */
router.put(
  "/:id",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharDoc", maxCount: 1 },
    { name: "panDoc", maxCount: 1 },
    { name: "licenseDoc", maxCount: 1 },
    { name: "fassiDoc", maxCount: 1 },
    { name: "gstDoc", maxCount: 1 }
  ]),
  validate(updateVendorSchema),
  controller.updateVendor
);


/* ===============================
   DELETE VENDOR
================================= */
router.delete("/:id", controller.deleteVendor);


/* ===============================
   TOGGLE STATUS
================================= */
router.patch("/:id/status", controller.toggleStatus);


module.exports = router;