import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiServiceResponse } from '../@types/apiServiceResponse';
import { logger } from '../config/logger';
import ProductService from '../service/implementations/ProductService';

export default class ProductController {

    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    getProductsList = async (req: Request, res: Response) => {
        try {
            const productResponse: ApiServiceResponse = await this.productService.getProductsList(req.userInfo);
            const { code, message, data } = productResponse.response;
            res.status(productResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createProduct = async (req: Request, res: Response) => {
        try {
            const productResponse: ApiServiceResponse = await this.productService.createProduct(req.body, req.userInfo);
            const { code, message, data } = productResponse.response;
            res.status(productResponse.statusCode).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}
