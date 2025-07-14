const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

// Export report Excel
router.get(
  "/excel",
  checkPermission("READ_REPORT"),
  reportController.exportReportExcel
);
// List riwayat report
router.get(
  "/history",
  checkPermission("READ_REPORT"),
  reportController.getReportHistory
);
// Download ulang report
router.get(
  "/download/:id",
  checkPermission("READ_REPORT"),
  reportController.downloadReportById
);

module.exports = router;
