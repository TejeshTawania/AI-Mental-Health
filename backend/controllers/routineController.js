const {
  getTemplate,
  saveUserRoutine,
  getUserRoutines,
  toggleRoutineItem,
  deleteUserRoutine,
} = require("../models/routineModel");
const { generateRoutine } = require("../models/chatModel");

function getRoutineTemplate(req, res) {
  const { concern } = req.params;
  const template = getTemplate(concern);
  if (!template) {
    return res
      .status(404)
      .json({ error: "No template found for that concern" });
  }
  res.json({ concern, items: template });
}

async function getAIRoutine(req, res) {
  const { concern } = req.params;
  if (!concern || typeof concern !== "string") {
    return res.status(400).json({ error: "concern is required" });
  }
  try {
    const items = await generateRoutine(concern);
    res.json({ concern, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate routine" });
  }
}

async function createRoutine(req, res) {
  const { concern, items } = req.body;
  if (!concern || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "concern and a non-empty items array are required" });
  }
  try {
    const routine = await saveUserRoutine(req.userId, concern, items);
    res.status(201).json(routine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save routine" });
  }
}

async function listRoutines(req, res) {
  try {
    const routines = await getUserRoutines(req.userId);
    res.json(routines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch routines" });
  }
}

async function toggleRoutineItemCompletion(req, res) {
  const { id } = req.params;
  const { itemIndex } = req.body;
  if (itemIndex === undefined || typeof itemIndex !== "number") {
    return res.status(400).json({ error: "itemIndex (number) is required" });
  }
  try {
    const routine = await toggleRoutineItem(req.userId, id, itemIndex);
    if (!routine) {
      return res.status(404).json({ error: "Routine not found" });
    }
    res.json(routine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not toggle routine item" });
  }
}

async function deleteRoutine(req, res) {
  const { id } = req.params;
  try {
    const result = await deleteUserRoutine(req.userId, id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Routine not found" });
    }
    res.json({ message: "Routine deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete routine" });
  }
}

module.exports = {
  getRoutineTemplate,
  getAIRoutine,
  createRoutine,
  listRoutines,
  toggleRoutineItemCompletion,
  deleteRoutine,
};
