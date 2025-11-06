import express from "express";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartControllers.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/", requireSignIn, getCart); 
cartRouter.post("/add", requireSignIn, addToCart);
cartRouter.put("/update/:productId", requireSignIn, updateCartQuantity);
cartRouter.delete("/remove/:productId", requireSignIn, removeFromCart);
cartRouter.delete("/clear", requireSignIn, clearCart);

export default cartRouter; 
