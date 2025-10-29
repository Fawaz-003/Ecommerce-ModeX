import express from "express";
import {
  addRecentView,
  getRecentViews,
  clearRecentViews,
} from "../controllers/recentViewControllers.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const recentViewRouter = express.Router();

recentViewRouter.post("/add", requireSignIn, addRecentView);
recentViewRouter.get("/", requireSignIn, getRecentViews);
recentViewRouter.delete("/clear", requireSignIn, clearRecentViews);

export default recentViewRouter;
