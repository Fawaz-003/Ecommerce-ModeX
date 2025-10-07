import express from "express";
import { addAddress, removeAddress, editAddress } from "../controllers/addressControllers.js";

const addressRouter = express.Router();

addressRouter.post("/add/:userId", addAddress);
addressRouter.delete("/remove/:userId/:addressId", removeAddress);
addressRouter.put("/edit/:userId/:addressId", editAddress );

export default addressRouter;

