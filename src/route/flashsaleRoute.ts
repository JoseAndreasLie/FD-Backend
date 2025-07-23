import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import FlashsaleController from '../controllers/FlashsaleController';
import { auth } from '../middlewares/auth';

const router = Router();

const flashsaleController = new FlashsaleController();

router.get(
    '/', 
    auth(),
    flashsaleController.getFlashSaleList
);

router.post(
    '/',
    auth(),
    flashsaleController.createFlashSale
);

router.get(
    '/:flashsaleId',
    auth(),
    flashsaleController.getFlashSaleById
);

router.put(
    '/:flashsaleId',
    auth(),
    flashsaleController.updateFlashSale
);

router.delete(
    '/:flashsaleId',
    auth(),
    flashsaleController.deleteFlashSale
);

export default router;
