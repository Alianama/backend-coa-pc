const express = require("express");
const router = express.Router();
const masterCustomerController = require("../controllers/master_customer");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

// Customer routes
router.post("/", masterCustomerController.createCustomer);
router.get("/", masterCustomerController.getAllCustomers);
router.get("/valid-fields", masterCustomerController.getValidFields);
router.get("/:id", masterCustomerController.getCustomerById);
router.put("/:id", masterCustomerController.updateCustomer);
router.delete("/:id", masterCustomerController.deleteCustomer);

// Mandatory fields routes
// router.post("/mandatory-fields", masterCustomerController.createMandatoryField);
// router.put(
//   "/mandatory-fields/:id",
//   masterCustomerController.updateMandatoryField
// );
// router.delete(
//   "/mandatory-fields/:id",
//   masterCustomerController.deleteMandatoryField
// );
// router.get(
//   "/:customerId/mandatory-fields",
//   masterCustomerController.getMandatoryFields
// );

module.exports = router;
