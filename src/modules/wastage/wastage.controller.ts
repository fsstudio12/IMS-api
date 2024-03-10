import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync, extractBusinessId } from '../utils';
import { ApiError } from '../errors';
import createSuccessResponse from '../success/SuccessResponse';
import * as wastageService from './wastage.service';
import { IWastageDoc } from './wastage.interfaces';

export const createWastageHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const wastage = await wastageService.createWastage({ ...req.body, businessId });
  res.send(createSuccessResponse({ wastage }));
});

export const getWastagesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const wastages = await wastageService.findWastagesByFilterQuery({ businessId });
  res.send(createSuccessResponse({ wastages }));
});

export const getWastageHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['wastageId'] === 'string') {
    const wastage = await wastageService.findWastageById(new mongoose.Types.ObjectId(req.params['wastageId']));
    if (!wastage) throw new ApiError(httpStatus.NOT_FOUND, 'Wastage not found.');

    res.send(createSuccessResponse({ wastage }));
  }
});

export const updateWastageHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['wastageId'] === 'string') {
    const wastage = await wastageService.updateWastageById(new mongoose.Types.ObjectId(req.params['wastageId']), req.body);
    res.send(createSuccessResponse({ wastage }));
  }
});

export const deleteWastageHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['wastageId'] === 'string') {
    await wastageService.deleteWastageById(req.params['wastageId'], req.user.businessId);
    res.send(createSuccessResponse());
  }
});

export const filterWastagesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  console.log('🚀 ~ filterWastagesHandler ~ businessId:', businessId);
  let wastages: IWastageDoc[] = [];
  if (req.query['filterType'] === 'date') {
    wastages = await wastageService.getWastagesByDate(businessId);
  } else {
    wastages = await wastageService.getWastagesByItem(businessId);
  }

  res.send(createSuccessResponse({ wastages }));
});
