require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { getReply } = require("./models/chatModel");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  
const app = express();
app.use(cors());
app.use(express.json());


app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== 'string') {
        return res.status(400).json({ error: 'message is required' });
    }
    try {
        const reply = await getReply(userMessage);
        res.json({ message: reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});