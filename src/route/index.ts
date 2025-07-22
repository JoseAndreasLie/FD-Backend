import { Router } from 'express';
import authRoute from './authRoute';
import flashsaleRoute from './flashsaleRoute';
import productRoute from './productRoute';
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
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
