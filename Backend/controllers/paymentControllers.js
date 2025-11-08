import crypto from "crypto";
import razorpayInstance from "../config/razorpayConfig.js";
import "dotenv/config"; 

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; 

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required and must be positive." });
    }

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};


export const verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified successfully." });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Failed to verify payment", error: error.message });
  }
};

export const getRazorpayKey = (req, res) => {
  try {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Razorpay key", error: error.message });
  }
}
