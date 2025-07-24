import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiServiceResponse } from '../@types/apiServiceResponse';
import { logger } from '../config/logger';
// import { IQueue } from '../models/interfaces/IQueue';
import QueueService from '../service/implementations/QueueService';

export default class QueueController {
    private queueService: QueueService;

    constructor() {
        this.queueService = new QueueService();
    }

    createQueue = async (req: Request, res: Response) => {
        try {
            const queueResponse: ApiServiceResponse = await this.queueService.createQueue(
                req.body,
                req.params
            );
            const { code, message, data } = queueResponse.response;
            res.status(queueResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getQueueByDeviceId = async (req: Request, res: Response) => {
        try {
            const queueResponse: ApiServiceResponse = await this.queueService.getQueueByDeviceId(
                req.params.deviceId
            );
            const { code, message, data } = queueResponse.response;
            res.status(queueResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}