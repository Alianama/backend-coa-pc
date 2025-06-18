const express = require("express");
const router = express.Router();
const printCoaController = require("../controllers/print_coa.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

// Print COA routes
router.post("/:coaId", checkPermission("PRINT_COA"), printCoaController.print);

router.get("/", checkPermission("READ_PRINT_COA"), printCoaController.getAll);

router.get(
  "/:id",
  checkPermission("READ_PRINT_COA"),
  printCoaController.getById
);

module.exports = router;
