import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiServiceResponse } from '../@types/apiServiceResponse';
import { logger } from '../config/logger';
import BoothService from '../service/implementations/BoothService';

export default class BoothController {

    private boothService: BoothService;

    constructor() {
        this.boothService = new BoothService();
    }

    getBoothName = async (req: Request, res: Response) => {
        try {
            const boothResponse: ApiServiceResponse = await this.boothService.getBoothName(req.userInfo);
            const { code, message, data } = boothResponse.response;
            res.status(boothResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateBooth = async (req: Request, res: Response) => {
        try {
            const boothResponse: ApiServiceResponse = await this.boothService.updateBooth(req.body, req.userInfo);
            const { code, message, data } = boothResponse.response;
            res.status(boothResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getBoothNameById = async (req: Request, res: Response) => {
        try {
            const boothId = req.params.boothId;
            const boothResponse: ApiServiceResponse = await this.boothService.getBoothNameById(boothId);
            const { code, message, data } = boothResponse.response;
            res.status(boothResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
}
