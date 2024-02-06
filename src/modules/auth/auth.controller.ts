import { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import config from '../../config/config';

import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import createSuccessResponse from '../success/SuccessResponse';
import { businessService } from '../business';
import runInTransaction from '../utils/transactionWrapper';
import { ApiError } from '../errors';

export const registerHandler = catchAsync(async (req: Request, res: Response) => {
  await runInTransaction(async (session: ClientSession) => {
    const business = await businessService.createBusiness(req.body, session);
    const user = await userService.registerUser({ ...req.body, businessId: business._id }, session);
    res.status(httpStatus.CREATED).send({ user });
  });
});

export const loginHandler = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(createSuccessResponse({ user, tokens }, 'Successfully logged in.'));
});

export const logoutHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokensHandler = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(createSuccessResponse({ ...userWithTokens }));
});

export const forgotPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  await runInTransaction(async (session: ClientSession) => {
    const [resetPasswordToken] = await tokenService.generateResetPasswordToken(req.body.email, session);
    if (!resetPasswordToken) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong.');
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res
      .status(config.env === 'development' ? httpStatus.OK : httpStatus.NO_CONTENT)
      .send(createSuccessResponse(config.env === 'development' && { resetPasswordToken }));
  });
});

export const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmailHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user.isEmailVerified) {
    await runInTransaction(async (session: ClientSession) => {
      const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user, session);
      await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);

      res
        .status(config.env === 'development' ? httpStatus.OK : httpStatus.NO_CONTENT)
        .send(createSuccessResponse(config.env === 'development' && { verifyEmailToken }));
    });
  } else {
    res.status(httpStatus.OK).send(createSuccessResponse(null, 'Your email is already verified.'));
  }
});

export const verifyEmailHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);
  res.status(httpStatus.NO_CONTENT).send();
});
