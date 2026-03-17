const express = require("express");
const router = express.Router();

const controller = require("./brand.controller");
const validate = require("../../middlewares/validate");

const {createBrandSchema,updateBrandSchema} = require("./brand.validator");

const upload = require("../../middlewares/upload.middleware");

/* ===============================
   GET BRANDS
================================= */

router.get("/", controller.getBrands);

/* ===============================
   CREATE BRAND
================================= */

router.post("/",upload.single("image"),validate(createBrandSchema),controller.createBrand);

/* ===============================
   UPDATE BRAND
================================= */

router.put("/:id",upload.single("image"),validate(updateBrandSchema),controller.updateBrand);

/* ===============================
   DELETE BRAND
================================= */

router.delete("/:id", controller.deleteBrand);

/* ===============================
   TOGGLE STATUS
================================= */

router.patch("/:id/status", controller.toggleStatus);

module.exports = router;