import httpStatus from 'http-status';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import responseHandler from '../../helper/responseHandler';
import models from '../../models';

export default class ProductService {
    getProductsList = async (userInfo) => {
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

            const products = await models.products.findAll({
                where: {
                    booth_id: userBooth.id,
                    deleted_at: null,
                },
                order: [['name', 'ASC']],
                attributes: {
                    exclude: [
                        'created_at',
                        'updated_at',
                        'deleted_at',
                    ]
                }
            });

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Products Retrieved Successfully',
                products
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }

    createProduct = async (body, userInfo) => {
        try {
            const { name, price, img_url } = body;

            if (!name || !price || !img_url) {
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

            const newProduct = await models.products.create({
                id: uuid.v4(),
                name,
                price: Number(price) || 0,
                img_url,
                booth_id: userBooth.id,
            });

            return responseHandler.returnSuccess(
                httpStatus.CREATED,
                'Product Created Successfully',
                newProduct
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    updateProduct = async (id, body, userInfo) => {
        try {
            const { name, price, img_url } = body;

            if (!name || !price || !img_url) {
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

            const product = await models.products.findOne({
                where: {
                    id,
                    booth_id: userBooth.id,
                    deleted_at: null,
                },
                attributes: {
                    exclude: [
                        'created_at',
                        'updated_at',
                        'deleted_at',
                    ]
                }
            });

            if (!product) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'Product Not Found');
            }

            product.name = name;
            product.price = parseFloat(price) || 0;
            product.img_url = img_url;

            await product.save();

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Product Updated Successfully',
                product
            );
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }
}
