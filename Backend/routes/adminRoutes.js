import express from "express";
import { adminDashboard } from "../controllers/adminControllers.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", requireSignIn, isAdmin, adminDashboard);

export default adminRouter;