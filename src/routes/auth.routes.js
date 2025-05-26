const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.get("/profile", verifyToken, authController.getOwnProfile);
router.post("/logout", verifyToken, authController.logout);
router.post("/users", verifyToken, authController.createUser);

module.exports = router;
