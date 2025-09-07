import express from 'express';
import  upload from '../utils/multer.js';
import {addProduct, ProductList, ProductById, changeStock} from '../controllers/productControllers.js';

const productRouter = express.Router();


productRouter.post('/add', upload.array('images'),  addProduct);
productRouter.get('/list', ProductList);
productRouter.get('/id', ProductById);
productRouter.post('/stock', changeStock);

export default productRouter;