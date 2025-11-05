

const express = require("express");
const router = express.Router();
const { signup, login, me } = require("./controllers/authController.js");
const authMiddleware = require("./middleware/authMiddleware");

router.get("/me", authMiddleware, me);

router.post("/signup", signup);

router.post("/login", login);
  
module.exports = router;
