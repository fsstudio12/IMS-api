import { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, pick } from '../utils';
import { IOptions } from '../paginate/paginate';

import * as businessService from './business.service';
import createSuccessResponse from '../success/SuccessResponse';
import runInTransaction from '../utils/transactionWrapper';

export const createBusinessHandler = catchAsync(async (req: Request, res: Response) => {
  await runInTransaction(async (session: ClientSession) => {
    const business = await businessService.createBusiness(req.body, session);
    res.send(httpStatus.CREATED).send(createSuccessResponse(business));
  });
});

export const getBusinessesHandler = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'email']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const results = await businessService.queryBusinesses(filter, options);
  res.send(createSuccessResponse(results));
});
