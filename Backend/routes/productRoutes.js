import express from 'express';
import  upload from '../utils/multer.js';
import { requireSignIn } from '../middleware/authMiddleware.js';
import { addProduct, addReview, deleteProduct, getWishlistProducts, ProductList, singleProduct, updateProduct } from '../controllers/productControllers.js';

const productRouter = express.Router();


productRouter.post('/add', upload.array('images'), addProduct);
productRouter.put('/update/:productId', upload.array('images'), updateProduct);
productRouter.delete('/delete/:productId', deleteProduct);
productRouter.get('/list', ProductList);
productRouter.get('/:productId', singleProduct);
productRouter.post('/bulk', getWishlistProducts);
productRouter.post("/:productId/add/review", requireSignIn, addReview);

export default productRouter; 