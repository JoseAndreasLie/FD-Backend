import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';

export default class QueueService {
    createQueue = async (body, params) => {
        const flashsale = await models.flashsales.findOne({
            where: {
                id: params.id,
                deleted_at: null,
            },
        });

        if (!flashsale) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'Flashsale Not Found');
        }

        // generate ticket code with ALPHANUMERIC 4 CHARACTERS
        const ticketCode = Math.random().toString(36).substring(2, 6).toUpperCase();

        // queue number is from booth latest queue status
        const QueueNumber = await models.queue_entries.findOne({
            where: {
                flashsale_id: flashsale.id,
                deleted_at: null,
            },
            // attributes: ['queue_number'],
            order: [['created_at', 'DESC']],
        });

        console.log('\n\t\tBefore Detecting before, auto incrementing', QueueNumber ? QueueNumber.queue_number : 'No Queue Number Found');

        let QNumber = 0;

        if(!QueueNumber) {
            QNumber = 1;
        } else {
            QNumber = QueueNumber.queue_number + 1;
        }

        console.log('\n\t\tAfter Detecting before, auto incrementing', QNumber);

        const queue = await models.queue_entries.create({
            id: uuid.v4(),
            booth_id: flashsale.booth_id,
            flashsale_id: flashsale.id,
            ticket_code: ticketCode,
            queue_number: QNumber,
            device_id: body.device_id,
            join_time: new Date(),
            called_time: null,
            served_time: null,
            status: "active",
        });

        return responseHandler.returnSuccess(
            httpStatus.CREATED,
            'Queue Created Successfully',
            queue
        );
    };
}
