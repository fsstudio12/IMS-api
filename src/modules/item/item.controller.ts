import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync, extractBusinessId } from '../utils';
import { ApiError } from '../errors';

import * as itemService from './item.service';
import createSuccessResponse from '../success/SuccessResponse';

export const createItemHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const item = await itemService.createItem({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ item }));
});

export const getItemsHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const items = await itemService.getItemTableListHandler(businessId);
  res.send(createSuccessResponse({ items }));
});

export const getItemHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['itemId'] === 'string') {
    const item = await itemService.findItemById(new mongoose.Types.ObjectId(req.params['itemId']));
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found.');
    res.send(createSuccessResponse({ item }));
  }
});

export const updateItemHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['itemId'] === 'string') {
    const businessId = extractBusinessId(req);

    const item = await itemService.updateItemById(new mongoose.Types.ObjectId(req.params['itemId']), {
      ...req.body,
      businessId,
    });

    res.status(httpStatus.OK).send(createSuccessResponse({ item }));
  }
});

export const deleteItemHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['itemId'] === 'string') {
    const businessId = extractBusinessId(req);
    await itemService.deleteItemsById(req.query['itemId'], businessId);
    res.send(createSuccessResponse());
  }
});

export const itemTableListHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const tableListItems = await itemService.getItemTableListHandler(businessId);

  res.send(createSuccessResponse({ items: tableListItems }));
});
