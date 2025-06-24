const express = require("express");
const router = express.Router();
const masterProductController = require("../controllers/master_product");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

// Product routes
router.post(
  "/",
  checkPermission("CREATE_PRODUCT"),
  masterProductController.createProduct
);

router.get(
  "/",
  checkPermission("READ_PRODUCT"),
  masterProductController.getAllProducts
);

router.get(
  "/:id",
  checkPermission("READ_PRODUCT"),
  masterProductController.getProductById
);

router.put(
  "/:id",
  checkPermission("UPDATE_PRODUCT"),
  masterProductController.updateProduct
);

router.delete(
  "/:id",
  checkPermission("DELETE_PRODUCT"),
  masterProductController.deleteProduct
);

module.exports = router;
