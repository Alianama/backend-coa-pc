const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Hanya admin/superadmin yang bisa manage user
router.get("/", checkPermission("MANAGE_USERS"), userController.getAll);
router.get("/me", userController.getOwnProfile);
router.get("/:id", checkPermission("MANAGE_USERS"), userController.getById);
router.put("/:id", checkPermission("MANAGE_USERS"), userController.update);
router.put(
  "/:id/reset-password",
  checkPermission("MANAGE_USERS"),
  userController.resetPassword
);
router.delete("/:id", checkPermission("MANAGE_USERS"), userController.delete);
router.post("/add", checkPermission("MANAGE_USERS"), userController.createUser);
router.delete(
  "/:id",
  checkPermission("MANAGE_USERS"),
  userController.deleteUser
);

module.exports = router;
