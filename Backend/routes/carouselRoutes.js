import express from "express";
import upload from "../utils/multer.js";
import {
  createSlide,
  deleteSlide,
  getSlides,
  updateSlide,
} from "../controllers/carouselControllers.js";

const carouselRouter = express.Router();

carouselRouter.post("/add", upload.single("image"), createSlide);
carouselRouter.get("/all", getSlides);
carouselRouter.delete("/remove/:id", deleteSlide);
carouselRouter.put("/:id", upload.single("image"), updateSlide);

export default carouselRouter;
