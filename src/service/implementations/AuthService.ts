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
import { responseMessageConstant } from '../../config/constant';

export default class AuthService implements IAuthService {
    private userDao: UserDao;

    private tokenDao: TokenDao;

    private redisService: RedisService;

    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }

    loginWithEmailPassword = async (email: string, password: string) => {
        try {
            // find user by
            let userData = await this.userDao.findOne({
                where: { email: email },
            });

            // validate user is exist, user is active and user password is valid
            if (
                !userData ||
                !(await bcrypt.compare(password, userData.password))
            ) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    responseMessageConstant.LOGIN_400_INCORRECT_EMAIL_OR_PASS
                );
            }

            // get role data
            // let roles = await userData.getRoles({
            //     attributes: ['id', 'name', 'level'],
            //     order: [['level', 'ASC']],
            //     raw: true,
            //     limit: 1,
            //     joinTableAttributes: [],
            // });

            

            // parse sequelize object to raw object for delete password data
            userData = userData.toJSON();

            // delete password data in user json
            delete userData.password;
            delete userData.biometric;

            return responseHandler.returnSuccess(
                httpStatus.OK,
                responseMessageConstant.LOGIN_200_SUCCESS,
                { ...userData }
            );
        } catch (e) {
            console.log(e);
            return responseHandler.returnError(
                httpStatus.BAD_GATEWAY,
                responseMessageConstant.HTTP_502_BAD_GATEWAY
            );
        }
    };

    logout = async (req: Request, res: Response) => {
        const refreshTokenDoc = await this.tokenDao.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            res.status(httpStatus.NOT_FOUND).send({ message: 'User Not found!' });
        }
        await this.tokenDao.remove({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        await this.tokenDao.remove({
            token: req.body.access_token,
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });
        await this.redisService.removeToken(req.body.access_token, 'access_token');
        await this.redisService.removeToken(req.body.refresh_token, 'refresh_token');
        return true;
    };
}
