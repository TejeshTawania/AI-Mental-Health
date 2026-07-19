const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  stress: {
    type: Number,
    min: 1,
    max: 10,
  },
  energy: {
    type: Number,
    min: 1,
    max: 10,
  },
  sleep: {
    type: Number,
    min: 0,
    max: 24,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Checkin = mongoose.model("Checkin", checkinSchema);

async function logCheckin(userId, data) {
  const checkin = new Checkin({ userId, ...data });
  await checkin.save();
  return checkin;
}

async function getCheckinHistory(userId) {
  return Checkin.find({ userId }).sort({ date: -1 }).limit(30);
}

async function hasCheckedInToday(userId) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const existing = await Checkin.findOne({
    userId,
    date: {
      $gte: startOfToday,
      $lte: endOfToday,
    },
  });
  return !!existing;
}

function calculateStreak(checkins) {
  if (checkins.length === 0) return 0;

  const dates = checkins
    .map((c) => new Date(c.date).toDateString())
    .filter((d, i, arr) => arr.indexOf(d) === i); // unique days only

  let streak = 0;
  let cursor = new Date();

  for (let i = 0; i < dates.length; i++) {
    const expected = cursor.toDateString();
    if (dates.includes(expected)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

module.exports = { logCheckin, getCheckinHistory, calculateStreak, hasCheckedInToday };
