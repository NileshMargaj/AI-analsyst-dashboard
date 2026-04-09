import express from 'express';
import { validateRegistration,
    validateLogin } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();

//! User authentication routes: registration and login
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);

export default router;