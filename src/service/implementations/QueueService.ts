import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';

export default class QueueService {
    // for user scan qrcode
    createQueue = async (body, params) => {
        const transaction = await models.sequelize.transaction(); // Add transaction for consistency

        try {
            console.log('\n\n\t\tCreating queue with body:\n', body, 'and params:', params);
            const flashsale = await models.flashsales.findOne({
                where: {
                    id: params.flashsaleId,
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
            const ticketCode = `${Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')}-${Math.floor(100 + Math.random() * 900)}`;

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
            const queue = await models.queue_entries.findAll({
                where: {
                    device_id: deviceId,
                    status: 'active',
                    deleted_at: null,
                },
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
    };

    getBoothQueue = async (userInfo) => {
        try {
            const booth = await models.booths.findOne({
                where: {
                    user_id: userInfo.id,
                    deleted_at: null,
                },
            });

            if (!booth) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Booth Not Found');
            }

            // find one flashsale closest one from now active

            const currentTime = new Date();
            const flashsale = await models.flashsales.findOne({
                where: {
                    booth_id: booth.id,
                    // start_time: { [Op.lte]: currentTime },
                    flashsale_inactive_utc: { [Op.gte]: currentTime },
                    deleted_at: null,
                },
                order: [['flashsale_active_utc', 'ASC']],
            });

            console.log('Flashsale:', flashsale);

            const queueStatus = await models.queue_statuses.findOne({
                where: {
                    booth_id: booth.id,
                    flashsale_id: flashsale.id,
                    deleted_at: null,
                },
                attributes: ['current_queue_number'],
                order: [['created_at', 'DESC']],
            });

            let queue = await models.queue_entries.findAll({
                where: {
                    booth_id: booth.id,
                    flashsale_id: flashsale.id,
                    called_time: null,
                    status: 'active',
                    deleted_at: null,
                },
                attributes: ['id', 'ticket_code', 'queue_number'],
                order: [['queue_number', 'ASC']],
            });

            if (queue && queue.length > 0) {
                console.log('Masuk mapping queue:', queue);
                queue = queue.map((q) => ({
                    id: q.id,
                    ticket_code: q.ticket_code,
                    queue_number: q.queue_number,
                }));
            } else {
                queue = [];
            }

            // queue = queue entries
            queueStatus ? queueStatus.current_queue_number : 0

            // current queue number order

            let currentQueueProducts = [];

            console.log('Queue Status:', queueStatus);

            if (queueStatus !== 0) {
                let currentQueueDetail = await models.queue_entries.findOne({
                    where: {
                        booth_id: booth.id,
                        flashsale_id: flashsale.id,
                        queue_number: queueStatus.current_queue_number,
                        deleted_at: null,
                    },
                    order: [['created_at', 'DESC']],
                });

                console.log('Current Queue Detail:', currentQueueDetail);

                // console.log('Current Queue Detail:', currentQueueDetail);

                currentQueueProducts = await models.queue_entry_products.findAll({
                    where: {
                        queue_entry_id: currentQueueDetail.id,
                        deleted_at: null,
                    },
                    include: [{
                        model: models.products,
                        as: 'product',
                        attributes: ['id', 'name', 'price', 'img_url'],
                    }],
                    attributes: ['product_id', 'quantity'],
                });
            }



            const result = {
                flashsale: {
                    id: flashsale.id,
                    name: flashsale.name,
                    start_time: flashsale.start_time,
                    end_time: flashsale.end_time,
                    queue_early_access_time: flashsale.queue_early_access_time,
                },
                current_queue_number: queueStatus,
                queue,
                current_queue_products_order: currentQueueProducts
            };

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Booth Queue Retrieved Successfully',
                result
            );
        } catch (e) {
            logger.error('Error retrieving booth queue:', e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    nextQueue = async (userInfo, flashsaleId) => {

        console.log('Next Queue called with userInfo:', userInfo, 'and flashsaleId:', flashsaleId);
        try {
            const booth = await models.booths.findOne({
                where: {
                    user_id: userInfo.id,
                    deleted_at: null,
                },
            });

            if (!booth) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Booth Not Found');
            }

            const flashsale = await models.flashsales.findOne({
                where: {
                    id: flashsaleId,
                    booth_id: booth.id,
                    deleted_at: null,
                },
            });

            if (!flashsale) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Flashsale Not Found');
            }

            const queueStatus = await models.queue_statuses.findOne({
                where: {
                    booth_id: booth.id,
                    flashsale_id: flashsale.id,
                    deleted_at: null,
                },
                order: [['created_at', 'DESC']],
            });

            if (!queueStatus) {
                // if not found, create a new queue status
                await models.queue_statuses.create({
                    id: uuid.v4(),
                    booth_id: booth.id,
                    flashsale_id: flashsale.id,
                    current_queue_number: 0,
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }

            // Get the next queue entry
            const nextQueue = await models.queue_entries.findOne({
                where: {
                    booth_id: booth.id,
                    flashsale_id: flashsale.id,
                    called_time: null,
                    status: 'active',
                    deleted_at: null,
                },
                order: [['queue_number', 'ASC']],
            });

            if (!nextQueue) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'No Active Queue Found');
            }

            // Update the queue entry to set called_time
            nextQueue.called_time = new Date();
            await nextQueue.save();

            // Update the queue status
            queueStatus.current_queue_number = nextQueue.queue_number;
            await queueStatus.save();

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Next Queue Processed Successfully',
                { ticket_code: nextQueue.ticket_code, queue_number: nextQueue.queue_number }
            );
        } catch (e) {
            logger.error('Error processing next queue:', e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };
}
