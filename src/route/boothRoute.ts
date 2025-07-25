import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import BoothController from '../controllers/BoothController';
import { auth } from '../middlewares/auth';

const router = Router();

const boothController = new BoothController();

router.get(
    '/',
    auth(),
    boothController.getBoothName
);

router.put(
    '/', 
    auth(),
    boothController.updateBooth
);

export default router;
