const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Routes yang memerlukan permission MANAGE_USERS
router.get("/", userController.getAllUsers);

module.exports = router;
