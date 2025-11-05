import express from "express";
import { signup, login, me } from "./controllers/authController.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, me);
router.post("/signup", signup);
router.post("/login", login);

export default router;
