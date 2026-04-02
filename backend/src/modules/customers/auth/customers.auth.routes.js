import express from 'express';
const router = express.Router();

import customersAuthController from './customers.auth.controller.js';
import { signupSchema, verifyOtpSchema, loginSchema, resendOtpSchema, refreshSchema, logoutSchema } from './customers.auth.validator.js';
import validate from '../../../middlewares/validate.js';
import rateLimit from 'express-rate-limit';

// Rate limiter: 20 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/signup", authLimiter, validate(signupSchema), customersAuthController.signup);
router.post("/login", authLimiter, validate(loginSchema), customersAuthController.login);
router.post("/verify-otp", authLimiter, validate(verifyOtpSchema), customersAuthController.verifyOtp);
router.post("/resend-otp", authLimiter, validate(resendOtpSchema), customersAuthController.resendOtp);
router.post("/refresh-token", authLimiter, validate(refreshSchema), customersAuthController.refreshToken);
router.post("/logout", authLimiter, validate(logoutSchema), customersAuthController.logout);

export default router;



