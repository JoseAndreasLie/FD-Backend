import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { auth } from '../middlewares/auth';

const router = Router();

const productController = new ProductController();

router.get(
    '/', 
    auth(),
    productController.getProductsList
);

router.post(
    '/',
    auth(),
    productController.createProduct
);

router.put(
    '/:id',
    auth(),
    productController.updateProduct
);

router.delete(
    '/:id',
    auth(),
    productController.deleteProduct
);

export default router;
