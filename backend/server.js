require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Fail fast on missing runtime environment variables (except in testing contexts)
if (process.env.NODE_ENV !== "test") {
  const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET", "GROQ_API_KEY"];
  for (const envVar of REQUIRED_ENV) {
    if (!process.env[envVar]) {
      console.error(`CRITICAL BOOT CONFIG ERROR: Environment variable "${envVar}" is missing.`);
      process.exit(1);
    }
  }
}

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://ai-mental-health-qyxd.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin header (like mobile apps, curls, or serverless rewrites)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        const errorMsg = `CORS Policy Error: Origin '${origin}' is not authorized.`;
        return callback(new Error(errorMsg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Standard system health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

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
