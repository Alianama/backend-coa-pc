const express = require("express");
const router = express.Router();

// Import routes
const authRoutes = require("./auth.routes");
const masterCoaRoutes = require("./master_coa.routes");
const userRoutes = require("./user.routes");
const roleRoutes = require("./role.routes");
const masterCustomerRoutes = require("./master_customer");
const masterProductRoutes = require("./master_product");
const printCoaRoutes = require("./print_coa");
const planningHeaderRoutes = require("./planning.routes");

// Use routes
router.use("/auth", authRoutes);
router.use("/coa", masterCoaRoutes);
router.use("/users", userRoutes);
router.use("/role", roleRoutes);
router.use("/customer", masterCustomerRoutes);
router.use("/product", masterProductRoutes);
router.use("/print", printCoaRoutes);
router.use("/planning", planningHeaderRoutes);

module.exports = router;
