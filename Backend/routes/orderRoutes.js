import express from "express";
import { createOrder, getAllOrders } from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", requireSignIn, createOrder);
orderRouter.get("/", requireSignIn, isAdmin, getAllOrders);
orderRouter.get("/all-orders", requireSignIn, isAdmin, getAllOrders);

export default orderRouter;