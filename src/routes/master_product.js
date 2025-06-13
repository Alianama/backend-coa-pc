const express = require("express");
const router = express.Router();
const masterProductController = require("../controllers/master_product");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

// Product routes
router.post(
  "/",
  checkPermission("create_products"),
  masterProductController.createProduct
);

router.get(
  "/",
  checkPermission("view_products"),
  masterProductController.getAllProducts
);

router.get(
  "/:id",
  checkPermission("view_products"),
  masterProductController.getProductById
);

router.put(
  "/:id",
  checkPermission("edit_products"),
  masterProductController.updateProduct
);

router.delete(
  "/:id",
  checkPermission("delete_products"),
  masterProductController.deleteProduct
);

module.exports = router;
