import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import { toggleBanUser, toggleVerifyUser } from './admin.service';
import createSuccessResponse from '../success/SuccessResponse';

export const toggleVerifyUserHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await toggleVerifyUser(new mongoose.Types.ObjectId(req.params['userId']));
    res.send(createSuccessResponse());
  }
});

export const toggleBanUserHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await toggleBanUser(new mongoose.Types.ObjectId(req.params['userId']));
    res.send(createSuccessResponse());
  }
});
