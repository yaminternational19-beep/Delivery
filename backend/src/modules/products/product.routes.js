import express from 'express';
const router = express.Router();

import productController from './product.controller.js';
import { createProductSchema } from './product.validator.js';
import validate from '../../middlewares/validate.js';
import upload from '../../middlewares/upload.middleware.js';
import authenticate from '../../middlewares/auth.middleware.js';
import jsonParser from '../../middlewares/jsonParser.js';

// GET all products with pagination and filters
router.get("/", authenticate, productController.getAllProducts);

// POST create product with images
router.post("/", 
  authenticate,
  upload.array("images", 10),
  jsonParser(['specification', 'variants', 'images']),
  validate(createProductSchema),
  productController.createProduct
);

export default router;