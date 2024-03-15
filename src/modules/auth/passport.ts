import mongoose from 'mongoose';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import tokenTypes from '../token/token.types';
import config from '../../config/config';
import { IPayload } from '../token/token.interfaces';
import { getEmployeesByFilterQuery } from '../employee/employee.service';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const [employee] = await getEmployeesByFilterQuery({
        _id: new mongoose.Types.ObjectId(payload.sub),
      });

      if (!employee) {
        return done(null, false);
      }

      done(null, employee);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
