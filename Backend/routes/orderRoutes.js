import express from "express";
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", requireSignIn, createOrder);
orderRouter.get("/all-orders", requireSignIn, isAdmin, getAllOrders);
orderRouter.get("/my-orders", requireSignIn, getUserOrders);

// Update order status (Admin only)
orderRouter.put("/status/:orderId", requireSignIn, isAdmin, updateOrderStatus);

export default orderRouter;