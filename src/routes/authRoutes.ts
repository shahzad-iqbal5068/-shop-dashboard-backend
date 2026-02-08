import { Router } from "express";
import authController from "../controllers/authController";
const router = Router();

// Define your auth routes here if needed
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/register", authController.RegisterUser);
router.post("/verify-otp", authController.verifyOtp);
export default router;
