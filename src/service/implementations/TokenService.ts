import httpStatus from 'http-status';
import responseHandler from '../../helper/responseHandler';
import { responseMessageConstant } from '../../config/constant';
import ITokenService from '../contracts/ITokenService';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { tokenTypes } from '../../config/tokens';
import ApiError from '../../helper/ApiError';

export default class TokenService implements ITokenService {
    generateAccessToken = async (id: string) => {
        const iat = Date.now();
        return jwt.sign(
            {
                sub: id,
                type: tokenTypes.ACCESS,
                iat: iat,
            },
            config.jwt.secret,
            {
                // 60000 is 1 minute
                expiresIn: Number(config.jwt.accessExpirationMinutes) * 60000,
            }
        );
    };

    generateRefreshToken = async (id: string) => {
        const iat = Date.now();
        return jwt.sign(
            {
                sub: id,
                type: tokenTypes.REFRESH,
                iat: iat,
            },
            config.jwt.secret,
            {
                // ((3600000 is 1 hour) * 24) is 1 day
                expiresIn: Number(config.jwt.refreshExpirationDays * 24) * 3600000,
            }
        );
    };

    generateAuthToken = async (id: string) => {
        try {
            // create access token and refresh token
            const accessToken = await this.generateAccessToken(id);
            const refreshToken = await this.generateRefreshToken(id);

            // decode token to get the expire time
            const decodeAccessToken = await this.verifyToken(accessToken);
            const decodeRefreshToken = await this.verifyToken(refreshToken);

            // convert expires to date type
            let expAccessToken = new Date(decodeAccessToken.exp);
            let expRefreshToken = new Date(decodeRefreshToken.exp);

            // create token object for return
            const tokens = {
                access: { token: accessToken, expires: expAccessToken.toString() },
                refresh: { token: refreshToken, expires: expRefreshToken.toString() },
            };

            return tokens;
        } catch (e) {
            throw new Error();
        }
    };

    verifyToken = async (token: string) => {
        try {
            const payload: any = await jwt.verify(token, config.jwt.secret);
            return payload;
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    responseMessageConstant.TOKEN_401_EXPIRED
                );
            }

            throw new ApiError(httpStatus.UNAUTHORIZED, responseMessageConstant.TOKEN_400_INVALID);
        }
    };
}
