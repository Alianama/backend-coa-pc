const express = require("express");
const router = express.Router();
const { getEChartsData } = require("../controllers/color_trend.controller");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/echarts", getEChartsData);

module.exports = router;
