const express = require("express");
const router = express.Router();
const masterCustomerController = require("../controllers/master_customer");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

// Customer routes
router.post(
  "/",
  checkPermission("CREATE_CUSTOMER"),
  masterCustomerController.createCustomer
);
router.get(
  "/",
  checkPermission("READ_CUSTOMER"),
  masterCustomerController.getAllCustomers
);
router.get(
  "/valid-fields",
  checkPermission("READ_CUSTOMER"),
  masterCustomerController.getValidFields
);
router.get(
  "/:id",
  checkPermission("READ_CUSTOMER"),
  masterCustomerController.getCustomerById
);
router.put(
  "/:id",
  checkPermission("UPDATE_CUSTOMER"),
  masterCustomerController.updateCustomer
);
router.delete(
  "/:id",
  checkPermission("DELETE_CUSTOMER"),
  masterCustomerController.deleteCustomer
);

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
