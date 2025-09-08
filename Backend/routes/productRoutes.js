import express from 'express';
import  upload from '../utils/multer.js';
import { addProduct, ProductList, ProductById } from '../controllers/productControllers.js';

const productRouter = express.Router();


productRouter.post('/add', upload.array('images'),  addProduct);
productRouter.get('/list', ProductList);
productRouter.get('/:id', ProductById);


export default productRouter;