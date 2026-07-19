const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  concern: { type: String, required: true },
  items: [
    {
      text: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Routine = mongoose.model("Routine", routineSchema);

const TEMPLATES = {
  stress: [
    "Take 5 slow, deep breaths",
    "Step outside for 5 minutes",
    "Write down what's on your mind",
    "Stretch for 2 minutes",
  ],
  sleep: [
    "No screens 30 minutes before bed",
    "Keep a consistent bedtime",
    "Dim the lights an hour before sleep",
    "Avoid caffeine after 2pm",
  ],
  motivation: [
    "Write down one small goal for today",
    "Celebrate yesterday's progress, even if small",
    "Break your next task into 3 smaller steps",
    "Do the easiest task first to build momentum",
  ],
};

function getTemplate(concern) {
  return TEMPLATES[concern] || null;
}

async function saveUserRoutine(userId, concern, items) {
  const formattedItems = items.map((item) => {
    if (typeof item === "string") {
      return { text: item, completed: false };
    }
    return item;
  });
  const routine = new Routine({
    userId,
    concern,
    items: formattedItems,
    updatedAt: new Date(),
  });
  await routine.save();
  return routine;
}

async function getUserRoutines(userId) {
  const routines = await Routine.find({ userId }).sort({ createdAt: -1 });
  const todayStr = new Date().toDateString();

  for (let r of routines) {
    const routineDateStr = new Date(r.updatedAt || r.createdAt).toDateString();
    if (routineDateStr !== todayStr) {
      // It's a new day! Reset completion status
      r.items.forEach((item) => {
        item.completed = false;
      });
      r.updatedAt = new Date();
      await r.save();
    }
  }

  return routines;
}

async function toggleRoutineItem(userId, routineId, itemIndex) {
  const routine = await Routine.findOne({ _id: routineId, userId });
  if (!routine) return null;
  if (routine.items[itemIndex]) {
    routine.items[itemIndex].completed = !routine.items[itemIndex].completed;
    routine.updatedAt = new Date();
    await routine.save();
  }
  return routine;
}

async function deleteUserRoutine(userId, routineId) {
  return Routine.deleteOne({ _id: routineId, userId });
}

module.exports = {
  getTemplate,
  saveUserRoutine,
  getUserRoutines,
  toggleRoutineItem,
  deleteUserRoutine,
  Routine,
};
