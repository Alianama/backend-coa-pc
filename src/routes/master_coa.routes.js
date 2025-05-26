const express = require("express");
const router = express.Router();
const masterCoaController = require("../controllers/master_coa.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Routes yang memerlukan permission CREATE_COA
router.post("/", checkPermission("CREATE_COA"), masterCoaController.create);

// Routes yang memerlukan permission READ_COA
router.get("/", checkPermission("READ_COA"), masterCoaController.getAll);

// Routes untuk COA yang dihapus (harus di atas route /:id)
router.get(
  "/deleted",
  checkPermission("READ_COA"),
  masterCoaController.getDeleted
);

router.post(
  "/deleted/:id/restore",
  checkPermission("CREATE_COA"),
  masterCoaController.restore
);

router.delete(
  "/deleted/:id",
  checkPermission("DELETE_COA"),
  masterCoaController.permanentDelete
);

// Routes yang memerlukan permission READ_COA
router.get("/:id", checkPermission("READ_COA"), masterCoaController.getById);

// Routes yang memerlukan permission UPDATE_COA
router.put("/:id", checkPermission("UPDATE_COA"), masterCoaController.update);

// Routes yang memerlukan permission DELETE_COA
router.delete(
  "/:id",
  checkPermission("DELETE_COA"),
  masterCoaController.delete
);

// Routes yang memerlukan permission APPROVE_COA
router.post(
  "/:id/approve",
  checkPermission("APPROVE_COA"),
  masterCoaController.approve
);

// Routes yang memerlukan permission UPDATE_COA untuk request approval
router.post("/:id/request-approval", masterCoaController.requestApproval);

module.exports = router;
