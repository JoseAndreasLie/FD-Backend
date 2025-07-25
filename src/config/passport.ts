import { ExtractJwt, Strategy } from 'passport-jwt';
import { tokenTypes } from './tokens';
import { config } from './config';
import UserDao from '../dao/implementations/UserDao';
import models from '../models';

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
};

const jwtVerify = async (req, payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS && !req.url.includes('/refresh')) {
            return done(null, false);
        } 

        const userDao = new UserDao();
        const auth =
            req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : [];
        if (auth[1] === undefined) {
            return done(null, false);
        }

        const expired = new Date(payload.exp);
        const date = new Date();

        const user = await userDao.findOne({ id: payload.sub });

        if (!user || date > expired) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
};
const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
export { jwtStrategy };
