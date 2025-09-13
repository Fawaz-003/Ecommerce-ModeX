import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import productRouter from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
connectCloudinary();

const allowedOrigins = [
  "https://ecommerce-mode-x.vercel.app", 
  "http://localhost:5173"               
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);

app.get('/ping', (req, res) => {
  res.json({ message: 'Server awake' });
});

app.get('/', (req, res) => { 
    res.send("Hello i am from backend");
});

app.listen(PORT, () => {
    console.log(`server is runing at port ${PORT}`)
});
 