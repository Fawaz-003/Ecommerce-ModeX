import crypto from "crypto";
import razorpayInstance from "../config/razorpayConfig.js";
import Order from "../models/orderModels.js";
import UserProfile from "../models/userProfileModels.js";
import userModel from "../models/userModels.js";
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


export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      addressId 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment verification details." 
      });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed." 
      });
    }

    // Signature verified - Create order if user is authenticated
    if (req.user && addressId) {
      try {
        // Get user profile with cart
        const userProfile = await UserProfile.findOne({ user: req.user._id })
          .populate({
            path: "cart.product",
            model: "product"
          });

        if (!userProfile || !userProfile.cart || userProfile.cart.length === 0) {
          return res.status(400).json({ 
            success: false, 
            message: "Cart is empty. Cannot create order." 
          });
        }

        // Get selected address
        const selectedAddress = userProfile.addresses?.find(
          addr => addr._id.toString() === addressId
        );

        if (!selectedAddress) {
          return res.status(400).json({ 
            success: false, 
            message: "Shipping address not found." 
          });
        }

        // Calculate totals
        let totalAmount = 0;
        const orderItems = userProfile.cart.map(item => {
          const itemTotal = item.price * item.quantity;
          totalAmount += itemTotal;
          return {
            product: item.product._id,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          };
        });

        // Add platform fee (20) and tax (1% of subtotal)
        const platformFee = 20;
        const tax = totalAmount * 0.01;
        totalAmount = totalAmount + platformFee + tax;

        // Get user details
        const user = await userModel.findById(req.user._id);

        // Create order
        const newOrder = new Order({
          user: req.user._id,
          customerName: user.name,
          items: orderItems,
          totalAmount: totalAmount,
          shippingAddress: selectedAddress,
          paymentDetails: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
          orderStatus: "Processing",
          paymentStatus: "Paid",
        });

        await newOrder.save();

        // Clear cart after successful order
        userProfile.cart = [];
        await userProfile.save();

        return res.status(200).json({ 
          success: true, 
          message: "Payment verified and order created successfully.",
          order: newOrder
        });
      } catch (orderError) {
        console.error("Error creating order:", orderError);
        // Even if order creation fails, payment is verified
        return res.status(200).json({ 
          success: true, 
          message: "Payment verified successfully but order creation failed.",
          warning: orderError.message
        });
      }
    }

    // Payment verified but no user context (shouldn't happen but handle gracefully)
    res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully." 
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify payment", 
      error: error.message 
    });
  }
};

export const getRazorpayKey = (req, res) => {
  try {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Razorpay key", error: error.message });
  }
}
