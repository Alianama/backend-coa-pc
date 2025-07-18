const express = require("express");
const router = express.Router();

// Import routes
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const roleRoutes = require("./role.routes");
const masterCustomerRoutes = require("./master_customer");
const masterProductRoutes = require("./master_product");
const printCoaRoutes = require("./print_coa");
const planningHeaderRoutes = require("./planning.routes");
const productStandardRoutes = require("./product_standard");
const colorTrendRoutes = require("./color_trend");
const dashboardRoutes = require("./dashboard.routes");
const reportRoutes = require("./report.routes");

// Use routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/role", roleRoutes);
router.use("/customer", masterCustomerRoutes);
router.use("/product", masterProductRoutes);
router.use("/print", printCoaRoutes);
router.use("/planning", planningHeaderRoutes);
router.use("/product-standard", productStandardRoutes);
router.use("/trend", colorTrendRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/report", reportRoutes);

module.exports = router;
