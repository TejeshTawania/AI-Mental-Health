const express = require("express");
const cors = require("cors");
const {getReply} = require("./models/chatModels");
const app = express();
app.use(cors());
app.use(express.json());



app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    if(!userMessage || typeof userMessage !== 'string'){ //Checking if the message is valid
        return res.status(400).json({error: "invalid input"})
    }

    const response = getReply(userMessage);
    res.json({message : response});
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
