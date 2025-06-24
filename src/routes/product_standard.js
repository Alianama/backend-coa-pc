const express = require("express");
const router = express.Router();
const controller = require("../controllers/product_standard.controller");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/", controller.getAllProductStandards);
router.get("/product/:product_id", controller.getProductStandardsByProduct);
router.post("/", controller.createProductStandard);
router.put("/:id", controller.updateProductStandard);
router.delete("/:id", controller.deleteProductStandard);

module.exports = router;
