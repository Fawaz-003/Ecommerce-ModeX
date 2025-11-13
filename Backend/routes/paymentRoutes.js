import express from "express";
import { createOrder, verifyPayment, getRazorpayKey } from "../controllers/paymentControllers.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/checkout", requireSignIn, createOrder);
paymentRouter.post("/paymentverification", requireSignIn, verifyPayment);
paymentRouter.get("/getkey", getRazorpayKey);

export default paymentRouter;