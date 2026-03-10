const Joi = require("joi");


/* ===============================
   CREATE VENDOR
================================= */

const createVendorSchema = Joi.object({

  businessName: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  category: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),

  fullName: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  countryCode: Joi.string()
    .default("+91"),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  emergencyCountryCode: Joi.string()
    .allow(null, ""),

  emergencyMobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow(null, ""),

  /* ADDRESS */

  address: Joi.string().allow("", null),

  country: Joi.string().default("India"),

  state: Joi.string().allow("", null),

  city: Joi.string().allow("", null),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .allow("", null),

  latitude: Joi.string().allow("", null),

  longitude: Joi.string().allow("", null),

  /* PERSONAL IDS */

  aadharNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .allow("", null),

  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .allow("", null),

  /* BUSINESS IDS */

  licenseNumber: Joi.string().allow("", null),

  fassiCode: Joi.string().allow("", null),

  gstNumber: Joi.string().allow("", null),

  /* BANK DETAILS */

  bankName: Joi.string().allow("", null),

  accountName: Joi.string().allow("", null),

  accountNumber: Joi.string().allow("", null),

  ifsc: Joi.string().allow("", null),

  /* TIER */

  tier: Joi.string()
    .valid("Silver", "Gold", "Platinum")
    .default("Silver"),

  expectedTurnover: Joi.string().allow("", null),

  status: Joi.string()
    .valid("Active", "Inactive")
    .default("Active")

});


/* ===============================
   UPDATE VENDOR
================================= */

const updateVendorSchema = Joi.object({

  businessName: Joi.string()
    .trim()
    .min(2)
    .max(150),

  category: Joi.array()
    .items(Joi.string()),

  fullName: Joi.string()
    .trim()
    .min(2)
    .max(120),

  email: Joi.string().email(),

  countryCode: Joi.string(),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/),

  emergencyCountryCode: Joi.string().allow(null, ""),

  emergencyMobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow(null, ""),

  address: Joi.string().allow("", null),

  country: Joi.string(),

  state: Joi.string().allow("", null),

  city: Joi.string().allow("", null),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .allow("", null),

  latitude: Joi.string().allow("", null),

  longitude: Joi.string().allow("", null),

  aadharNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .allow("", null),

  panNumber: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .allow("", null),

  licenseNumber: Joi.string().allow("", null),

  fassiCode: Joi.string().allow("", null),

  gstNumber: Joi.string().allow("", null),

  bankName: Joi.string().allow("", null),

  accountName: Joi.string().allow("", null),

  accountNumber: Joi.string().allow("", null),

  ifsc: Joi.string().allow("", null),

  tier: Joi.string().valid("Silver", "Gold", "Platinum"),

  expectedTurnover: Joi.string().allow("", null),

  status: Joi.string().valid("Active", "Inactive")

});


/* ===============================
   EXPORTS
================================= */

module.exports = {
  createVendorSchema,
  updateVendorSchema
};