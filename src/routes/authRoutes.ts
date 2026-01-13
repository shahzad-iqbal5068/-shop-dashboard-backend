import { Router } from "express";
import { login, logout } from "../controllers/authController";

const router = Router();

// Define your auth routes here if needed
router.post("/login", login);
router.post("/logout", logout);

export default router;
