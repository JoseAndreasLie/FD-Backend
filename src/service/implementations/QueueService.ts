import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';

export default class QueueService {
    // for user scan qrcode
    createQueue = async (body, params) => {
        const transaction = await models.sequelize.transaction(); // Add transaction for consistency

        try {
            const flashsale = await models.flashsales.findOne({
                where: {
                    id: params.id,
                    deleted_at: null,
                },
                transaction,
            });

            if (!flashsale) {
                await transaction.rollback();
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Flashsale Not Found');
            }

            // generate ticket code with CCC-NNN Format
            // CCC = 4 random uppercase letters, NNN = 3 random digits
            const ticketCode = `${uuid.v4().slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

            // queue number is from booth latest queue status
            const QueueNumber = await models.queue_entries.findOne({
                where: {
                    flashsale_id: flashsale.id,
                    deleted_at: null,
                },
                order: [['created_at', 'DESC']],
                transaction,
            });

            let QNumber = 0;

            if (!QueueNumber) {
                QNumber = 1;
            } else {
                QNumber = QueueNumber.queue_number + 1;
            }

            const queue = await models.queue_entries.create(
                {
                    id: uuid.v4(),
                    booth_id: flashsale.booth_id,
                    flashsale_id: flashsale.id,
                    ticket_code: ticketCode,
                    queue_number: QNumber,
                    device_id: body.device_id,
                    join_time: new Date(),
                    called_time: null,
                    served_time: null,
                    status: 'active',
                },
                { transaction }
            );

            // Add products to queue_entry_products (remove manual ID)
            if (body.products && body.products.length > 0) {
                const queueProducts = body.products.map((product) => ({
                    // id: uuid.v4(), // Remove this line
                    queue_entry_id: queue.id,
                    product_id: product.id,
                    quantity: product.quantity,
                }));
                await models.queue_entry_products.bulkCreate(queueProducts, { transaction });
            }

            await transaction.commit();

            return responseHandler.returnSuccess(
                httpStatus.CREATED,
                'Queue Created Successfully',
                queue
            );
        } catch (e) {
            await transaction.rollback();
            logger.error('Queue creation failed:', e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    getQueueByDeviceId = async (deviceId) => {
        try {
            const queue = await models.queue_entries.findOne({
                where: {
                    device_id: deviceId,
                    status: 'active',
                    deleted_at: null,
                },
                include: [
                    {
                        model: models.flashsales,
                        as: 'flashsale',
                        attributes: ['id', 'name', 'start_time', 'end_time'],
                    },
                    {
                        model: models.queue_entry_products,
                        as: 'products',
                        attributes: ['product_id', 'quantity'],
                        include: [
                            {
                                model: models.products,
                                as: 'product',
                                attributes: ['id', 'name', 'price', 'img_url'],
                            },
                        ],
                    },
                ],
            });

            if (!queue) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Queue Not Found');
            }

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Queue Retrieved Successfully',
                queue
            );
        } catch (e) {
            logger.error('Error retrieving queue:', e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }
}
