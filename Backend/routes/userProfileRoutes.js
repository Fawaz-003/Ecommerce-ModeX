import express from "express";
import { createEditProfile, getProfile } from "../controllers/userProfileControllers.js";


const userProfileRouter = express.Router();

userProfileRouter.put("/edit/:userId", createEditProfile);
userProfileRouter.get("/:userId", getProfile);

export default userProfileRouter;
