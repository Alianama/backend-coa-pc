const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.get(
  "/profile",
  authMiddleware.verifyToken,
  authController.getOwnProfile
);
router.post("/logout", authMiddleware.verifyToken, authController.logout);
router.post("/users", authMiddleware.verifyToken, authController.createUser);

module.exports = router;
