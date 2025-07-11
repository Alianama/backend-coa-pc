const express = require("express");
const router = express.Router();
const {
  lotProgress,
  totalPlanning,
  totalPlanningPerBulan,
} = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth");

// Route dengan autentikasi
router.use(verifyToken);
router.get("/lot-progress", lotProgress);
router.get("/total-planning", totalPlanning);
router.get("/total-planning-perbulan", totalPlanningPerBulan);

module.exports = router;
