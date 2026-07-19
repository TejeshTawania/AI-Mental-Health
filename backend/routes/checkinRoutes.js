const express = require("express");
const router = express.Router();
const {requireAuth} = require("../middleware/authMiddleware");
const {createCheckin,listCheckins} = require("../controllers/checkinController");

router.post("/",requireAuth,createCheckin);
router.get("/",requireAuth,listCheckins);

module.exports = router;