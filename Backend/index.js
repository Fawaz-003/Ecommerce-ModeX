import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
connectCloudinary();

// ✅ Proper CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter)

app.get("/", (req, res) => {
  res.send("Hello i am from backend");
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
