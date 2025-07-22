import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';

export default class FlashsaleService {
    getFlashSaleList = async (userInfo) => {
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

            const userFlashSaleList = await models.flashsales.findAll({
                where: {
                    booth_id: userBooth.id,
                },
            });

            // Format the dates for display
            const formattedFlashSales = userFlashSaleList.map((flashsale) => ({
                ...flashsale.toJSON(),
                start_time: flashsale.start_time.toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                }),
                end_time: flashsale.end_time.toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                }),
            }));

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Flash Sale List Retrieved',
                formattedFlashSales
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    createFlashSale = async (body, userInfo) => {
        try {
            const { name, date, start_time, end_time, queue_early_access_minutes } = body;

            if (!name || !date || !start_time || !end_time) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Fields are required');
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

            // Create datetime in GMT+7 by subtracting 7 hours from UTC
            const startDateTimeUTC = new Date(`${date}T${start_time}:00.000Z`);
            const endDateTimeUTC = new Date(`${date}T${end_time}:00.000Z`);

            // Subtract 7 hours to get the correct UTC time that represents GMT+7
            const startDateTime = new Date(startDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);
            const endDateTime = new Date(endDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);

            // Validate that end time is after start time
            if (endDateTime <= startDateTime) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'End time must be after start time'
                );
            }

            const newFlashSale = await models.flashsales.create({
                id: uuid.v4(),
                name,
                booth_id: userBooth.id,
                start_time: startDateTime,
                end_time: endDateTime,
                queue_early_access_minutes: queue_early_access_minutes || 0,
            });

            return responseHandler.returnSuccess(
                httpStatus.CREATED,
                'Flash Sale Created Successfully',
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };
}
