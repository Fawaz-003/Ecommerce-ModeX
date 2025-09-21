import express from 'express';
import  upload from '../utils/multer.js';
import { addProduct, ProductList, singleProduct, updateProduct } from '../controllers/productControllers.js';

const productRouter = express.Router();


productRouter.post('/add', upload.array('images'), addProduct);
productRouter.put('/update/:productId', upload.array('images'), updateProduct);
productRouter.get('/list', ProductList);
productRouter.get('/:productId', singleProduct);

  
export default productRouter;  