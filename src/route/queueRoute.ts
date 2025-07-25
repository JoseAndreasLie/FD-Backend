import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import QueueController from '../controllers/QueueController';
import { auth } from '../middlewares/auth';

const router = Router();

const queueController = new QueueController();

router.post(
    '/', 
    auth(),
    queueController.nextQueue
);

router.get(
    '/booth',
    auth(),
    queueController.getBoothQueue
)

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
