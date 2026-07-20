const {
  createOrder,
  verifyPaymentSignature,
} = require("../models/paymentModel");
const User = require("../models/userModel");

async function initiatePayment(req, res) {
  try {
    const order = await createOrder(99);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
}

async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing razorpay fields" });
  }
  const isValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  if (!isValid) {
    return res.status(400).json({ error: "Invalid payment signature" });
  }
  try {
    await User.findByIdAndUpdate(req.userId, { isPremium: true });
    res.json({ message: "Payment verified successfully", isPremium: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update user" });
  }
}

module.exports = { initiatePayment, verifyPayment };
