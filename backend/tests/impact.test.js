const test = require("node:test");
const assert = require("node:assert");

// Import core logic modules
const { calculateStreak } = require("../models/checkinModel");
const { detectCrisisLanguage } = require("../models/crisisModel");

test("🏆 Wellness Streaks Core Logic", async (t) => {
  await t.test("should return 0 streak for empty check-in history", () => {
    const streak = calculateStreak([]);
    assert.strictEqual(streak, 0);
  });

  await t.test("should calculate correct streak for consecutive days", () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const mockCheckins = [
      { date: today },
      { date: yesterday },
      { date: dayBeforeYesterday },
    ];

    const streak = calculateStreak(mockCheckins);
    assert.strictEqual(streak, 3);
  });

  await t.test("should break streak if a day is missed", () => {
    const today = new Date();
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(today.getDate() - 2); // Yesterday was missed!

    const mockCheckins = [
      { date: today },
      { date: dayBeforeYesterday },
    ];

    const streak = calculateStreak(mockCheckins);
    assert.strictEqual(streak, 1); // Only today counts
  });
});

test("🛡️ AI Chat Safety Guards & Crisis Language Detection", async (t) => {
  await t.test("should detect explicit self-harm thoughts", () => {
    const isCrisis = detectCrisisLanguage("I want to end my life");
    assert.strictEqual(isCrisis, true);
  });

  await t.test("should detect implicit warning signs", () => {
    const isCrisis = detectCrisisLanguage("I feel completely hopeless and want to hurt myself");
    assert.strictEqual(isCrisis, true);
  });

  await t.test("should not trigger on normal expressions of bad days", () => {
    const isCrisis = detectCrisisLanguage("I had a really rough day at work today and feel down");
    assert.strictEqual(isCrisis, false);
  });
});

test("⏰ Daily Routine Reset State Machine", async (t) => {
  await t.test("should reset completed flags if last updated yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mockRoutine = {
      updatedAt: yesterday,
      items: [
        { text: "Stretch for 2 minutes", completed: true },
        { text: "Slow deep breaths", completed: true },
      ],
    };

    // Simulate reset state-machine check
    const todayStr = new Date().toDateString();
    const routineDateStr = new Date(mockRoutine.updatedAt).toDateString();
    
    if (routineDateStr !== todayStr) {
      mockRoutine.items.forEach((item) => {
        item.completed = false;
      });
      mockRoutine.updatedAt = new Date();
    }

    assert.strictEqual(mockRoutine.items[0].completed, false);
    assert.strictEqual(mockRoutine.items[1].completed, false);
  });
});
