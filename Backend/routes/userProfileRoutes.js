import express from "express";
import { createProfile, createEditProfile, getProfile } from "../controllers/userProfileControllers.js";


const userProfileRouter = express.Router();

userProfileRouter.put("/edit/:userId", createEditProfile);
userProfileRouter.get("/:userId", getProfile);
userProfileRouter.post("/create/:userId", createProfile );


export default userProfileRouter;
