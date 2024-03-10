import mongoose, { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, pick } from '../utils';
import { IOptions } from '../paginate/paginate';

import * as businessService from './business.service';
import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';
import runInTransaction from '../utils/transactionWrapper';

export const getBusinessesHandler = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'email']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const results = await businessService.queryBusinesses(filter, options);
  res.send(createSuccessResponse({ results }));
});

export const getBusinessHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['businessId'] === 'string') {
    const business = await businessService.getBusinessById(new mongoose.Types.ObjectId(req.params['businessId']));
    if (!business) throw new ApiError(httpStatus.NOT_FOUND, 'Business not found.');

    res.send(createSuccessResponse({ business }));
  }
});

export const updateBusinessHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['businessId'] === 'string') {
    const business = await businessService.updateBusinessById(
      new mongoose.Types.ObjectId(req.params['businessId']),
      req.body
    );

    res.send(createSuccessResponse({ business }));
  }
});

export const deleteBusinessHandler = catchAsync(async (req: Request, res: Response) => {
  await runInTransaction(async (session: ClientSession) => {
    if (typeof req.params['businessId'] === 'string') {
      await businessService.deleteBusinessById(new mongoose.Types.ObjectId(req.params['businessId']), session);
      res.status(httpStatus.NO_CONTENT).send();
    }
  });
});
