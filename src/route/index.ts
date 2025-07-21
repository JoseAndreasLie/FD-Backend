import { Router } from 'express';
import authRoute from './authRoute';
import flashsaleRoute from './flashsaleRoute';

const router = Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/flashsale',
        route: flashsaleRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
