const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Hanya admin/superadmin yang bisa manage user
router.get("/", checkPermission("MANAGE_USERS"), userController.getAll);
router.get("/:id", checkPermission("MANAGE_USERS"), userController.getById);
router.put("/:id", checkPermission("MANAGE_USERS"), userController.update);
router.delete("/:id", checkPermission("MANAGE_USERS"), userController.delete);

module.exports = router;
