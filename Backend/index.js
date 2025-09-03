import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

app.get('/', (req, res) => { 
    res.send("Hello i am from backend");
});

app.listen(PORT, () => {
    console.log(`server is runing at port ${PORT}`)
})
 