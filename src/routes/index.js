const express = require("express");
const router = express.Router();

// Import routes
const authRoutes = require("./auth.routes");
const masterCoaRoutes = require("./master_coa.routes");
const userRoutes = require("./user.routes");
const roleRoutes = require("./role.routes");
const masterCustomerRoutes = require("./master_customer");

// Use routes
router.use("/auth", authRoutes);
router.use("/coa", masterCoaRoutes);
router.use("/users", userRoutes);
router.use("/role", roleRoutes);
router.use("/customer", masterCustomerRoutes);

module.exports = router;
