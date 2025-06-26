const express = require("express");
const router = express.Router();
const printCoaController = require("../controllers/print_coa.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

// Print COA from planning
router.post(
  "/:planningId",
  checkPermission("PRINT_COA"),
  printCoaController.print
);

// Get all printed COAs
router.get("/", checkPermission("READ_PRINT_COA"), printCoaController.getAll);

// Get printed COA by ID
router.get(
  "/:id",
  checkPermission("READ_PRINT_COA"),
  printCoaController.getById
);

// Get printed COAs by planning ID
router.get(
  "/planning/:planningId",
  checkPermission("READ_PRINT_COA"),
  printCoaController.getByPlanningId
);

// Delete printed COA
router.delete(
  "/:id",
  checkPermission("DELETE_PRINT_COA"),
  printCoaController.delete
);

// Approve print COA
router.patch(
  "/:id/approve",
  checkPermission("APPROVE_PRINT_COA"),
  printCoaController.approvePrintCoa
);

// Reject print COA
router.patch(
  "/:id/reject",
  checkPermission("REJECT_PRINT_COA"),
  printCoaController.rejectPrintCoa
);

module.exports = router;
