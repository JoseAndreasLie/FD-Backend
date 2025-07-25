import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiServiceResponse } from '../@types/apiServiceResponse';
import { logger } from '../config/logger';
// import { IFlashsale } from '../models/interfaces/IFlashsale';
import FlashsaleService from '../service/implementations/FlashsaleService';

export default class FlashsaleController {
    private flashsaleService: FlashsaleService;

    constructor() {
        this.flashsaleService = new FlashsaleService();
    }

    getFlashSaleList = async (req: Request, res: Response) => {
        try {
            const flashSaleList: ApiServiceResponse = await this.flashsaleService.getFlashSaleList(
                req.userInfo
            );
            const { code, message, data } = flashSaleList.response;
            res.status(flashSaleList.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createFlashSale = async (req: Request, res: Response) => {
        try {
            const flashSale: ApiServiceResponse = await this.flashsaleService.createFlashSale(
                req.body,
                req.userInfo
            );
            const { code, message, data } = flashSale.response;
            res.status(flashSale.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getFlashSaleById = async (req: Request, res: Response) => {
        try {
            const flashSale: ApiServiceResponse = await this.flashsaleService.getFlashSaleById(
                req.params,
                req.userInfo
            );
            const { code, message, data } = flashSale.response;
            res.status(flashSale.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateFlashSale = async (req: Request, res: Response) => {
        try {
            const flashSale: ApiServiceResponse = await this.flashsaleService.updateFlashSale(
                req.params,
                req.body,
                req.userInfo
            );
            const { code, message, data } = flashSale.response;
            res.status(flashSale.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteFlashSale = async (req: Request, res: Response) => {
        try {
            const flashSale: ApiServiceResponse = await this.flashsaleService.deleteFlashSale(
                req.params,
                req.userInfo
            );
            const { code, message } = flashSale.response;
            res.status(flashSale.statusCode).send({ code, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };



    // ** USER USER USER USER USER USER USER USER USER  ** //
    getListOfFlashSales = async (req: Request, res: Response) => {
        try {
            let boothId = req.params.boothId;
            const booth = {
                id : boothId,
            }

            const flashSaleList: ApiServiceResponse = await this.flashsaleService.getFlashSaleListUser(
                booth
            );
            const { code, message, data } = flashSaleList.response;
            res.status(flashSaleList.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
}
