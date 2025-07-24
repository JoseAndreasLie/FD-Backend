import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import QueueController from '../controllers/QueueController';
import { auth } from '../middlewares/auth';

const router = Router();

const queueController = new QueueController();

// router.get(
//     '/', 
//     auth(),
//     queueController.getFlashSaleList
// );

router.post(
    '/:id',
    auth(),
    queueController.createQueue
);

router.get(
    '/:deviceId',
    auth(),
    queueController.getQueueByDeviceId
);

// router.put(
//     '/:queueId',
//     auth(),
//     queueController.updateFlashSale
// );

// router.delete(
//     '/:queueId',
//     auth(),
//     queueController.deleteFlashSale
// );

export default router;
