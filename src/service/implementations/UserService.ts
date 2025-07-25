/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';
import { Request } from 'express';
import { responseMessageConstant } from '../../config/constant';
import { logger } from '../../config/logger';
import UserDao from '../../dao/implementations/UserDao';
import responseHandler from '../../helper/responseHandler';
import { IUser } from '../../models/interfaces/IUser';
import IUserService from '../contracts/IUserService';

export default class UserService implements IUserService {
    private userDao: UserDao;

    constructor() {
        this.userDao = new UserDao();
    }

    isEmailExists = async (email: string) => {
        const message = 'Email found!';
        if (!(await this.userDao.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };
}
