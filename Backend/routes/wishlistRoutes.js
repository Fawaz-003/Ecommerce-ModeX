import express from "express";
import { addToWishlist, removeFromWishlist } from "../controllers/wishlistControllers.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add/:userId", addToWishlist);
wishlistRouter.delete("/remove/:userId", removeFromWishlist);

export default wishlistRouter;
