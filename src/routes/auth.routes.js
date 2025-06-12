const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const checkPermission = require("../middleware/checkPermission");

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
router.post(
  "/users",
  checkPermission("MANAGE_USERS"),
  authMiddleware.verifyToken,
  authController.createUser
);

module.exports = router;
