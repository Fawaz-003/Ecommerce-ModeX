import express from "express";
import {
  addCategory,
  editCategory,
  deleteCategory,
  listCategory,
  singleCategory,
} from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", addCategory);
categoryRouter.put("/edit/:id", editCategory);
categoryRouter.delete("/delete/:id", deleteCategory);
categoryRouter.get("/list", listCategory);
categoryRouter.get("/single/:id", singleCategory);

export default categoryRouter;
