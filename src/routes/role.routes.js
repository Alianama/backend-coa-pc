const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Role routes (memerlukan permission MANAGE_ROLES)
router.get("/", checkPermission("MANAGE_ROLES"), roleController.getAll);
router.post("/", checkPermission("MANAGE_ROLES"), roleController.create);
router.put("/:id", checkPermission("MANAGE_ROLES"), roleController.update);
router.delete("/:id", checkPermission("MANAGE_ROLES"), roleController.delete);

// Permission routes (memerlukan permission MANAGE_ROLES)
router.get(
  "/permissions",
  checkPermission("MANAGE_ROLES"),
  roleController.getAllPermissions
);
router.post(
  "/permissions",
  checkPermission("MANAGE_ROLES"),
  roleController.createPermission
);
router.put(
  "/permissions/:id",
  checkPermission("MANAGE_ROLES"),
  roleController.updatePermission
);
router.delete(
  "/permissions/:id",
  checkPermission("MANAGE_ROLES"),
  roleController.deletePermission
);

// User role management routes (memerlukan permission MANAGE_ROLES)
router.get(
  "/users",
  checkPermission("MANAGE_ROLES"),
  roleController.getUserRoles
);
router.put(
  "/users/:userId",
  checkPermission("MANAGE_ROLES"),
  roleController.updateUserRole
);

module.exports = router;
