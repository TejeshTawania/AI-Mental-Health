const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const {
  initiatePayment,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order", requireAuth, initiatePayment);
router.post("/verify", requireAuth, verifyPayment);

module.exports = router;
