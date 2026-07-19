const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const {
  getRoutineTemplate,
  getAIRoutine,
  createRoutine,
  listRoutines,
  toggleRoutineItemCompletion,
  deleteRoutine,
} = require("../controllers/routineController");

router.get("/template/:concern", requireAuth, getRoutineTemplate);
router.get("/ai/:concern", requireAuth, getAIRoutine);
router.post("/", requireAuth, createRoutine);
router.get("/", requireAuth, listRoutines);
router.patch("/:id/toggle", requireAuth, toggleRoutineItemCompletion);
router.delete("/:id", requireAuth, deleteRoutine);

module.exports = router;
