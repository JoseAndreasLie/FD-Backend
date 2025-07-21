import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import TokenDao from '../../dao/implementations/TokenDao';
import UserDao from '../../dao/implementations/UserDao';
import responseHandler from '../../helper/responseHandler';
import IAuthService from '../contracts/IAuthService';
import RedisService from './RedisService';
import { tokenTypes } from '../../config/tokens';

export default class FlashsaleService {
    private userDao: UserDao;

    private tokenDao: TokenDao;

    private redisService: RedisService;

    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }

    getFlashSaleList = async (userInfo) => {
        try {
            // // Assuming there's a method in UserDao to get the flash sale list
            // const flashSaleList = await this.userDao.getFlashSaleList();
            console.log('Fetching flash sale list for user:', userInfo);
            const flashSaleList = [
                {
                    // Sample data structure
                    id: 1,
                    title: 'Flash Sale 1',
                    discount: 50,
                    startTime: new Date(),
                    endTime: new Date(),
                },
                {
                    "userInfo": userInfo, // Include user info in the response
                },
            ];
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Flash Sale List Retrieved',
                flashSaleList
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };
}
