import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose, { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import config from '../../config/config';
import Token from './token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from './token.types';
import { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces';
import { IEmployeeDoc } from '../employee/employee.interfaces';
import { employeeService } from '../employee';

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const findToken = async (employeeId: mongoose.Types.ObjectId, type: string): Promise<ITokenDoc | null> =>
  Token.findOne({ employee: employeeId, type });

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  employeeId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: employeeId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
  token: string,
  employeeId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false,
  session: ClientSession | null = null
): Promise<ITokenDoc> => {
  const options = session ? { session } : undefined;

  const [tokenDoc] = await Token.create(
    [
      {
        token,
        employee: employeeId,
        expires: expires.toDate(),
        type,
        blacklisted,
      },
    ],
    options
  );
  if (!tokenDoc) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong.');
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad employee');
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    employee: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IEmployeeDoc} employee
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (employee: IEmployeeDoc): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(employee.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(employee.id, refreshTokenExpires, tokenTypes.REFRESH);

  const dbRefreshToken = await findToken(employee.id, tokenTypes.REFRESH);
  if (dbRefreshToken) await dbRefreshToken.deleteOne();

  await saveToken(refreshToken, employee.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

export const generateAccessToken = async (employee: IEmployeeDoc): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(employee.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshToken = await findToken(employee.id, tokenTypes.REFRESH);
  if (!refreshToken) throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token does not exist.');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken.token,
      expires: refreshToken?.expires,
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string, session: ClientSession | null = null): Promise<string> => {
  const employee = await employeeService.findEmployeeByEmail(email);
  if (!employee) {
    throw new ApiError(httpStatus.NO_CONTENT, '');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(employee.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, employee.id, expires, tokenTypes.RESET_PASSWORD, false, session);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {IEmployeeDoc} employee
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (
  employee: IEmployeeDoc,
  session: ClientSession | null = null
): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(employee.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, employee.id, expires, tokenTypes.VERIFY_EMAIL, false, session);
  return verifyEmailToken;
};
