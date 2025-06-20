const express = require("express");
const router = express.Router();
const planningHeaderController = require("../controllers/planning.controller");
const { verifyToken } = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_PLANNING_HEADER"),
  planningHeaderController.create
);
router.get(
  "/",
  checkPermission("READ_PLANNING_HEADER"),
  planningHeaderController.getAll
);
router.get(
  "/:id",
  checkPermission("READ_PLANNING_HEADER"),
  planningHeaderController.getById
);
router.put(
  "/:id",
  checkPermission("UPDATE_PLANNING_HEADER"),
  planningHeaderController.update
);
router.delete(
  "/:id",
  checkPermission("DELETE_PLANNING_HEADER"),
  planningHeaderController.delete
);

router.put(
  "/:id/close",
  checkPermission("UPDATE_PLANNING_HEADER"),
  planningHeaderController.closePlanning
);

router.put(
  "/:id/reopen",
  checkPermission("UPDATE_PLANNING_HEADER"),
  planningHeaderController.reopenPlanning
);

// PlanningDetail
router.post(
  "/detail",
  checkPermission("CREATE_PLANNING_HEADER"),
  planningHeaderController.createDetail
);
router.get(
  "/detail/by-planning/:idPlanning",
  checkPermission("READ_PLANNING_HEADER"),
  planningHeaderController.getDetailsByPlanningId
);
router.get(
  "/detail/by-lot/:lotNumber",
  checkPermission("READ_PLANNING_HEADER"),
  planningHeaderController.getDetailsByLotNumber
);
router.put(
  "/detail/:id",
  checkPermission("UPDATE_PLANNING_HEADER"),
  planningHeaderController.updateDetail
);
router.delete(
  "/detail/:id",
  checkPermission("DELETE_PLANNING_HEADER"),
  planningHeaderController.deleteDetail
);

module.exports = router;
