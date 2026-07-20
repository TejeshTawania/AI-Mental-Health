import { Sparkles } from "lucide-react";

const PremiumUnlock = ({ onUnlocked }) => {
  const handlePayment = async () => {
    const orderRes = await fetch(
      "http://localhost:3000/api/payment/create-order",
      {
        method: "POST",
        credentials: "include",
      },
    );
    const order = await orderRes.json();

    const options = {
      key: "rzp_test_TFhyPOIt89LR5F",
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Wellness Companion",
      description: "Unlock premium routines",
      handler: async (response) => {
        const verifyRes = await fetch(
          "http://localhost:3000/api/payment/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(response),
          },
        );
        const result = await verifyRes.json();
        if (verifyRes.ok) {
          onUnlocked();
        } else {
          alert("Payment verification failed: " + result.error);
        }
      },
      theme: { color: "#7A9B8E" },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="flex items-center gap-2 bg-[#7A9B8E] text-[#152019] text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#8CADA0] transition-colors"
    >
      <Sparkles className="w-4 h-4" />
      Unlock Premium — ₹99
    </button>
  );
};

export default PremiumUnlock;
