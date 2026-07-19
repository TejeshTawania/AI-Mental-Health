const {
  logCheckin,
  getCheckinHistory,
  calculateStreak,
  hasCheckedInToday,
} = require("../models/checkinModel");

async function createCheckin(req, res) {
  const { mood, stress, energy, note } = req.body;
  try {
    const alreadyCheckedIn = await hasCheckedInToday(req.userId);
    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "You have already logged a check-in today" });
    }
    const checkin = await logCheckin(req.userId, {
      mood,
      stress,
      energy,
      note,
    });
    res.status(201).json(checkin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not save checkin" });
  }
}

async function listCheckins(req, res) {
  try {
    const history = await getCheckinHistory(req.userId);
    const streak = calculateStreak(history);
    res.json({ history, streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch checkin history" });
  }
}

module.exports = { createCheckin, listCheckins };
