const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

const checkPermission = require("../middleware/checkPermission");

// router.use(verifyToken);

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.get("/profile", verifyToken, authController.getOwnProfile);
router.post("/logout", verifyToken, authController.logout);

// User management (hanya untuk admin/superadmin)
router.post(
  "/users",
  verifyToken,
  checkPermission("MANAGE_USERS"),
  authController.createUser
);
router.delete(
  "/users/:id",
  verifyToken,
  checkPermission("MANAGE_USERS"),
  authController.deleteUser
);

// Change password (user sendiri)
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
