import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { catchAsync } from '../utils';
import ApiError from '../errors/ApiError';
// import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';
import createSuccessResponse from '../success/SuccessResponse';

export const createUserHandler = catchAsync(async (req: Request, res: Response) => {
  // console.log('req user', req.user);
  const user = await userService.createUser({ ...req.body, businessId: req.user.businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ user }));
});

export const getUsersHandler = catchAsync(async (req: Request, res: Response) => {
  // const filter = pick(req.query, ['name', 'role']);
  // const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  // const result = await userService.queryUsers(filter, options);
  // res.send(createSuccessResponse(result));
  res.send(createSuccessResponse({ employees: await userService.getUsers(req.user) }));
});

// export const getUsersHandler = catchAsync(async (req: Request, res: Response) => {
//   console.log('req.user', req.user);
// });

export const getUserHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    res.send(createSuccessResponse({ user }));
  }
});

export const updateUserHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
    res.send(createSuccessResponse({ user }));
  }
});

export const deleteUserHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
