require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const { getReply } = require("./models/chatModel");
const { requireAuth } = require("./middleware/authMiddleware");
const {
  detectCrisisLanguage,
  getCrisisResponse,
} = require("./models/crisisModel");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const routineRoutes = require("./routes/routineRoutes");
app.use("/api/routine", routineRoutes);

const checkinRoutes = require("./routes/checkinRoutes");
app.use("/api/checkin", checkinRoutes);

app.post("/chat", requireAuth, async (req, res) => {
  const messages = req.body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "message is required" });
  }
  const latestMessage = messages[messages.length - 1];
  if (detectCrisisLanguage(latestMessage.text)) {
    return res.json({ message: getCrisisResponse(), isCrisisResponse: true });
  }
  try {
    const reply = await getReply(messages);
    res.json({ message: reply, isCrisisResponse: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
