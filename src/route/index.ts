import { Router } from 'express';
import authRoute from './authRoute';
import flashsaleRoute from './flashsaleRoute';
import productRoute from './productRoute';
import boothRoute from './boothRoute';
import queueRoute from './queueRoute';
import userRoute from './userRoute';
import path from 'path';

const router = Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/flashsale',
        route: flashsaleRoute,
    },
    {
        path: '/product',
        route: productRoute,
    },
    {
        path: '/booth',
        route: boothRoute,
    },
    {
        path: '/queue',
        route: queueRoute,
    },
    {
        path: '/user',
        route: userRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
