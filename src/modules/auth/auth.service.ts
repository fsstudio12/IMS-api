import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import { findEmployeeByEmail, findEmployeeById, updateEmployeeById } from '../employee/employee.service';
import { IEmployeeDoc, IEmployeeWithTokens } from '../employee/employee.interfaces';
import { generateAccessToken, verifyToken } from '../token/token.service';

/**
 * Login with employee name and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IEmployeeDoc>}
 */
export const loginEmployeeWithEmailAndPassword = async (email: string, password: string): Promise<IEmployeeDoc> => {
  const employee = await findEmployeeByEmail(email);
  if (!employee) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found.');
  if (employee.role !== 'super_admin' && employee?.isBanned)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your account is banned. Please contact NIMS for next steps.');
  if (!(await employee.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return employee;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IEmployeeWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IEmployeeWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const employee = await findEmployeeById(new mongoose.Types.ObjectId(refreshTokenDoc.employee));
    if (!employee) {
      throw new Error();
    }
    // await refreshTokenDoc.deleteOne();
    const tokens = await generateAccessToken(employee);
    return { employee, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const employee = await findEmployeeById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.employee));
    if (!employee) {
      throw new Error();
    }
    await updateEmployeeById(employee.id, { password: newPassword });
    await Token.deleteMany({ employee: employee.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IEmployeeDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IEmployeeDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const employee = await findEmployeeById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.employee));
    if (!employee) {
      throw new Error();
    }
    await Token.deleteMany({ employee: employee.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedEmployee = await updateEmployeeById(employee.id, { isEmailVerified: true });
    return updatedEmployee;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
