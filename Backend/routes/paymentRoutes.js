import express from "express";
import { createOrder, verifyPayment, getRazorpayKey } from "../controllers/paymentControllers.js";

const paymentRouter = express.Router();

paymentRouter.post("/checkout", createOrder);
paymentRouter.post("/paymentverification", verifyPayment);
paymentRouter.get("/getkey", getRazorpayKey);

export default paymentRouter;