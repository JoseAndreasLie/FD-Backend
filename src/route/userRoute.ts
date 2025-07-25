import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import QueueController from '../controllers/QueueController';
import { auth } from '../middlewares/auth';
import FlashsaleController from '../controllers/FlashsaleController';
import BoothController from '../controllers/BoothController';

const router = Router();

const queueController = new QueueController();
const flashsaleController = new FlashsaleController();
const boothController = new BoothController();

router.post(
    '/queue/:flashsaleId',
    queueController.createQueue
);

router.get(
    '/queue/:deviceId',
    queueController.getQueueByDeviceId
);

router.get(
    '/booth/:boothId',
    boothController.getBoothNameById
);

router.get(
    '/booth/:boothId/flashsales',
    flashsaleController.getListOfFlashSales
);


export default router;
