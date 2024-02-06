import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import config from '../../config/config';

import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import createSuccessResponse from '../success/SuccessResponse';

export const registerHandler = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
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
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res
    .status(config.env === 'development' ? httpStatus.OK : httpStatus.NO_CONTENT)
    .send(createSuccessResponse(config.env === 'development' && { resetPasswordToken }));
});

export const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmailHandler = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  if (!req.user.isEmailVerified) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
    res
      .status(config.env === 'development' ? httpStatus.OK : httpStatus.NO_CONTENT)
      .send(createSuccessResponse(config.env === 'development' && { verifyEmailToken }));
  }
  res.status(httpStatus.OK).send(createSuccessResponse(null, 'Your email is already verified.'));
});

export const verifyEmailHandler = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);
  res.status(httpStatus.NO_CONTENT).send();
});
