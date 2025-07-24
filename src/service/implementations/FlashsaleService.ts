import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';
import { includes } from 'lodash';

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
                    deleted_at: null,
                },
                order: [['name', 'ASC']],
                attributes: {
                    exclude: ['created_at', 'updated_at', 'deleted_at'],
                },
            });

            console.log('User Flash Sale List:', userFlashSaleList);

            // Format the dates for display
            const formattedFlashSales = userFlashSaleList.map((flashsale) => {
                const startTimeFormatted = flashsale.start_time.toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                });
                const endTimeFormatted = flashsale.end_time.toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                });
                const queueEarlyAccessFormatted = flashsale.queue_early_access_time
                    ? flashsale.queue_early_access_time.toLocaleString('en-US', {
                          timeZone: 'Asia/Jakarta',
                      })
                    : null;

                // Extract date and time parts
                const [startDate, startTime] = startTimeFormatted.split(', ');
                const [endDate, endTime] = endTimeFormatted.split(', ');
                const [queueDate, queueTime] = queueEarlyAccessFormatted
                    ? queueEarlyAccessFormatted.split(', ')
                    : [null, null];

                return {
                    ...flashsale.toJSON(),
                    // date: startDate, // "8/22/2025"
                    // start_time: startTime, // "11:00:00 AM"
                    // end_time: endTime, // "1:00:00 PM"
                    // queue_early_access_time: queueTime, // "10:00:00 AM"
                };
            });

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
        const transaction = await models.sequelize.transaction();

        try {
            const { name, date, start_time, end_time, queue_early_access_time, products } = body;

            if (!name || !date || !start_time || !end_time) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Fields are required');
            }

            // Validate start_time and end_time format is HH:MM:SS AM/PM
            const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
            if (!timeRegex.test(start_time) || !timeRegex.test(end_time) || !timeRegex.test(queue_early_access_time)) {
                await transaction.rollback();
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Start time, end time, and queue early access time must be in HH:MM AM/PM format'
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

            // // Create datetime in GMT+7 by subtracting 7 hours from UTC
            // const startDateTimeUTC = new Date(`${date}T${start_time}:00.000Z`);
            // const endDateTimeUTC = new Date(`${date}T${end_time}:00.000Z`);
            // const earlyDateTimeUTC = new Date(`${date}T${queue_early_access_time}:00.000Z`);

            // // Subtract 7 hours to get the correct UTC time that represents GMT+7
            // const startDateTime = new Date(startDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);
            // const endDateTime = new Date(endDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);
            // const earlyAccessTime = new Date(earlyDateTimeUTC.getTime() - 7 * 60 * 60 * 1000);

            // Validate that end time is after start time
            // if (endDateTime <= startDateTime) {
            //     await transaction.rollback();
            //     return responseHandler.returnError(
            //         httpStatus.BAD_REQUEST,
            //         'End time must be after start time'
            //     );
            // }

            // Validate that early access time is before start time
            // if (earlyAccessTime >= startDateTime) {
            //     await transaction.rollback();
            //     return responseHandler.returnError(
            //         httpStatus.BAD_REQUEST,
            //         'Early access time must be before start time'
            //     );
            // }

            // Create flashsale within transaction
            const flashsaleId = uuid.v4();
            const newFlashsale = await models.flashsales.create(
                {
                    id: flashsaleId,
                    name,
                    booth_id: userBooth.id,
                    date,
                    start_time,
                    end_time,
                    queue_early_access_time,
                },
                { transaction }
            );

            console.log('New Flashsale Created:', newFlashsale.toJSON());
            console.log('Products to be added:', products);

            // Validate all products exist before creating flashsale_products

            if(products) {
                const productValidations = await Promise.all(
                    products.map(async (product) => {
                        const productData = await models.products.findOne({
                            where: {
                                id: product.id,
                                booth_id: userBooth.id,
                            },
                            transaction,
                        });

                        if (!productData) {
                            throw new Error(`Product with ID ${product.id} not found in booth`);
                        }

                        return {
                            productData,
                            flashsale_price: product.flashsale_price || productData.price, // Use provided flashsale price or original price
                        };
                    })
                );

                // Create flashsale_products within transaction
                await Promise.all(
                    productValidations.map(async ({ productData, flashsale_price }) => {
                        await models.flashsale_products.create(
                            {
                                // Don't set id - let it auto-increment
                                id: uuid.v4(),
                                flashsale_id: flashsaleId,
                                product_id: productData.id,
                                is_sold_out: false,
                            },
                            { transaction }
                        );
                    })
                );
            }

            // Commit the transaction
            await transaction.commit();

            return responseHandler.returnSuccess(
                httpStatus.CREATED,
                'Flash Sale Created Successfully',
                newFlashsale
            );
        } catch (e) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            logger.error('Flash sale creation failed:', e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    getFlashSaleById = async (params, userInfo) => {
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

            const flashsale = await models.flashsales.findOne({
                where: {
                    id: params.flashsaleId,
                    booth_id: userBooth.id,
                    deleted_at: null,
                },
                // attributes: {
                //     exclude: ['created_at', 'updated_at', 'deleted_at'],
                // }
                include: [
                    {
                        model: models.products,
                        as: 'products',
                        through: {
                            attributes: ['is_sold_out'],
                        },
                    },
                ],
            });

            if (!flashsale) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Flash Sale Not Found');
            }

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Flash Sale Retrieved Successfully',
                flashsale
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    updateFlashSale = async (params, body, userInfo) => {
        const transaction = await models.sequelize.transaction();

        try {
            const { name, date, start_time, end_time, queue_early_access_time, products } = body;

            if (!name || !date || !start_time || !end_time) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Fields are required');
            }

            // Validate start_time and end_time format is HH:MM:SS AM/PM
            const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-5] (AM|PM)$/;
            if (!timeRegex.test(start_time) || !timeRegex.test(end_time) || !timeRegex.test(queue_early_access_time)) {
                await transaction.rollback();
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Start time and end time must be in HH:MM AM/PM format'
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

            const flashsale = await models.flashsales.findOne({
                where: {
                    id: params.flashsaleId,
                    booth_id: userBooth.id,
                    deleted_at: null,
                },
            });

            if (!flashsale) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Flash Sale Not Found');
            }

            // Update flashsale within transaction
            flashsale.name = name;
            flashsale.date = date;
            flashsale.start_time = start_time;
            flashsale.end_time = end_time;
            flashsale.queue_early_access_time = queue_early_access_time;

            await flashsale.save({ transaction });

            console.log('Flash Sale Updated:', flashsale.toJSON());
            console.log('Products to be updated:', products);

            // Validate all products exist before updating flashsale_products

            if (products){
                const productValidations = await Promise.all(
                    products.map(async (product) => {
                        const productData = await models.products.findOne({
                            where: {
                                id: product.id,
                                booth_id: userBooth.id,
                            },
                            transaction,
                        });
    
                        if (!productData) {
                            throw new Error(`Product with ID ${product.id} not found in booth`);
                        }
    
                        return {
                            productData,
                            flashsale_price: product.flashsale_price || productData.price, // Use provided flashsale price or original price
                        };
                    })
                );
                // Update flashsale_products within transaction
                await Promise.all(
                    productValidations.map(async ({ productData, flashsale_price }) => {
                        const flashsaleProduct = await models.flashsale_products.findOne({
                            where: {
                                flashsale_id: flashsale.id,
                                product_id: productData.id,
                            },
                            transaction,
                        });
    
                        if (flashsaleProduct) {
                            flashsaleProduct.flashsale_price = flashsale_price;
                            await flashsaleProduct.save({ transaction });
                        } else {
                            // If the product does not exist in the flash sale, create it
                            await models.flashsale_products.create(
                                {
                                    id: uuid.v4(),
                                    flashsale_id: flashsale.id,
                                    product_id: productData.id,
                                    is_sold_out: false,
                                    flashsale_price,
                                },
                                { transaction }
                            );
                        }
                    })
                );
            }
            // Commit the transaction
            await transaction.commit();
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Flash Sale Updated Successfully',
                flashsale
            );
        } catch (e) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            logger.error('Flash sale update failed:', e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    deleteFlashSale = async (params, userInfo) => {
        try {
            console.log('\n\n', params, userInfo);

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

            const flashsale = await models.flashsales.findOne({
                where: {
                    id: params.flashsaleId,
                    booth_id: userBooth.id,
                    deleted_at: null,
                },
            });

            console.log('Flashsale to delete:', flashsale);

            if (!flashsale) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Flash Sale Not Found');
            }

            // Soft delete the flash sale
            // flashsale.deleted_at = new Date();
            // await flashsale.save();

            await models.flashsales.destroy({
                where: {
                    id: flashsale.id,
                    booth_id: userBooth.id,
                    deleted_at: null,
                },
            });

            return responseHandler.returnSuccess(httpStatus.OK, 'Flash Sale Deleted Successfully');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };
}
