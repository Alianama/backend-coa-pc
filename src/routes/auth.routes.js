const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
// router.get("/profile", verifyToken, authController.getOwnProfile);
router.post("/logout", verifyToken, authController.logout);

// Change password (user sendiri)
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
