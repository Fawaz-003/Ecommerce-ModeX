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

app.use(cors({
  origin: [
    "http://localhost:5173",   // for local frontend dev
    "https://ecommerce-frontend-nu-teal.vercel.app" // your deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);

app.get('/', (req, res) => { 
    res.send("Hello i am from backend");
});

app.listen(PORT, () => {
    console.log(`server is runing at port ${PORT}`)
});
 