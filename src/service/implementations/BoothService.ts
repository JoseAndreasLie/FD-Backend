import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';

export default class BoothService {
    getBoothName = async (userInfo) => {
        try {
            const userBooth = await models.booths.findOne({
                where: {
                    user_id: userInfo.id,
                },
            });
            if (!userBooth) {
                return responseHandler.returnError(
                    httpStatus.NOT_FOUND,
                    'No Booth Found for the User'
                );
            }
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Booth Name Retrieved Successfully',
                { name: userBooth.name }
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    updateBooth = async (body, userInfo) => {
        try {
            const { name } = body;
            if (!name) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Booth name is required'
                );
            }

            const userBooth = await models.booths.findOne({
                where: {
                    user_id: userInfo.id,
                },
            });

            if (!userBooth) {
                return responseHandler.returnError(
                    httpStatus.NOT_FOUND,
                    'No Booth Found for the User'
                );
            }

            const updatedBooth = await userBooth.update({
                name,
            });

            // Convert to plain object and exclude fields
            const boothData = updatedBooth.toJSON();
            delete boothData.created_at;
            delete boothData.updated_at;

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Booth Updated Successfully',
                boothData
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };
}
