import Order from "../models/orderModels.js";
import UserProfile from "../models/userProfileModels.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentDetails,
    } = req.body;

    if (!userId || !items || !totalAmount || !shippingAddress || !paymentDetails) {
      return res.status(400).json({ success: false, message: "Missing required order fields." });
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentDetails,
      orderStatus: "Processing",
      paymentStatus: "Paid",
    });

    await newOrder.save();

    // After creating the order, find the user's profile and clear the cart
    const userProfile = await UserProfile.findOne({ user: userId });
    if (userProfile) {
      userProfile.cart = [];
      await userProfile.save();
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate({
        path: 'items.product',
        select: 'name images description brand',
        model: 'product'
      })
      .sort({ createdAt: -1 });

    // Handle cases where products might be deleted or not found
    const ordersWithProducts = orders.map(order => {
      const orderObj = order.toObject ? order.toObject() : order;
      return {
        ...orderObj,
        items: orderObj.items.map(item => ({
          ...item,
          product: item.product || { name: "Product Deleted", images: [], description: "", brand: "" }
        }))
      };
    });

    res.status(200).json({
      success: true,
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name images description brand',
        model: 'product'
      })
      .sort({ createdAt: -1 });

    // Handle cases where products might be deleted or not found
    const ordersWithProducts = orders.map(order => {
      const orderObj = order.toObject ? order.toObject() : order;
      return {
        ...orderObj,
        items: orderObj.items.map(item => ({
          ...item,
          product: item.product || { name: "Product Deleted", images: [], description: "", brand: "" }
        }))
      };
    });

    res.status(200).json({
      success: true,
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};