import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiServiceResponse } from '../@types/apiServiceResponse';
import { logger } from '../config/logger';
import { tokenTypes } from '../config/tokens';
import { IUser } from '../models/interfaces/IUser';
import AuthService from '../service/implementations/AuthService';
import TokenService from '../service/implementations/TokenService';
import UserService from '../service/implementations/UserService';
import responseHandler from '../helper/responseHandler';
import ApiError from '../helper/ApiError';
import { responseMessageConstant } from '../config/constant';

export default class AuthController {
    private userService: UserService;

    private tokenService: TokenService;

    private authService: AuthService;

    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    // register = async (req: Request, res: Response) => {
    //     try {
    //         const user: ApiServiceResponse = await this.userService.createUser(req.body);
    //         let tokens = {};
    //         const { status } = user.response;
    //         if (user.response.status) {
    //             tokens = await this.tokenService.generateAuthToken(<IUser>user.response.data);
    //         }
    //         const { message, data } = user.response;
    //         res.status(user.statusCode).send({ status, message, data, tokens });
    //     } catch (e) {
    //         logger.error(e);
    //         res.status(httpStatus.BAD_GATEWAY).send(e);
    //     }
    // };

    // checkEmail = async (req: Request, res: Response) => {
    //     try {
    //         const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
    //         res.status(isExists.statusCode).send(isExists.response);
    //     } catch (e) {
    //         logger.error(e);
    //         res.status(httpStatus.BAD_GATEWAY).send(e);
    //     }
    // };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await this.authService.loginWithEmailPassword(
                email.toLowerCase(),
                password
            );

            const { message } = user.response;
            const data = <IUser>user.response.data;
            const code = user.statusCode;

            if (code == 200 && data) {
                const tokens = await this.tokenService.generateAuthToken(data.id);
                return res.status(user.statusCode).send({ code, message, data, tokens });
            }

            return res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            return res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    // logout = async (req: Request, res: Response) => {
    //     await this.authService.logout(req, res);
    //     res.status(httpStatus.NO_CONTENT).send();
    // };

    refreshTokens = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refresh_token;
            if (!refreshToken) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid refresh token format');
            }

            const payload = await this.tokenService.verifyToken(refreshToken);

            if (payload.type !== tokenTypes.REFRESH) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    responseMessageConstant.TOKEN_400_INVALID
                );
            }

            const user = await req.userInfo;

            if (!user) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
            }

            const accessToken = await this.tokenService.generateAccessToken(user.id);

            if (!accessToken) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    responseMessageConstant.TOKEN_401_EXPIRED
                );
            }

            const decoded = await this.tokenService.verifyToken(accessToken);
            const exp = new Date(decoded.exp).toString();

            return res.status(httpStatus.OK).json({
                code: httpStatus.OK,
                message: responseMessageConstant.TOKEN_200_REFRESHED,
                data: {
                    access: {
                        token: accessToken,
                        expires: exp,
                    },
                },
            });
        } catch (error) {
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    code: error.statusCode,
                    message: error.message,
                });
            }

            logger.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            });
        }
    };

    // changePassword = async (req: Request, res: Response) => {
    //     try {
    //         const responseData = await this.userService.changePassword(req);
    //         res.status(responseData.statusCode).send(responseData.response);
    //     } catch (e) {
    //         logger.error(e);
    //         res.status(httpStatus.BAD_GATEWAY).send(e);
    //     }
    // };
}
