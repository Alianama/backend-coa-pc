const express = require("express");
const router = express.Router();
const { lotProgress } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth");

// Route dengan autentikasi
router.use(verifyToken);
router.get("/lot-progress", lotProgress);

module.exports = router;
