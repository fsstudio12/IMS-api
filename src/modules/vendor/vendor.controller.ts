import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, extractBusinessId } from '../utils';

import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

import * as vendorService from './vendor.service';
import { getPurchaseHistoryWithVendor } from '../purchase/purchase.service';

export const getVendorsHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const vendors = await vendorService.findVendorsByFilterQuery({ businessId });
  res.send(createSuccessResponse({ vendors }));
});

export const getVendorHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['vendorId'] === 'string') {
    const vendor = await vendorService.findVendorById(new mongoose.Types.ObjectId(req.params['vendorId']));
    if (!vendor) throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found.');

    res.send(createSuccessResponse({ vendor }));
  }
});

export const createVendorHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const vendor = await vendorService.createVendor({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ vendor }));
});

export const updateVendorHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['vendorId'] === 'string') {
    const businessId = extractBusinessId(req);

    const vendor = await vendorService.updateVendorById(new mongoose.Types.ObjectId(req.params['vendorId']), {
      ...req.body,
      businessId,
    });

    res.status(httpStatus.OK).send(createSuccessResponse({ vendor }));
  }
});

export const deleteVendorHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['vendorId'] === 'string') {
    await vendorService.deleteVendorById(req.params['vendorId'], req.employee.businessId);
    res.send(createSuccessResponse());
  }
});

export const getVendorHistoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['vendorId'] === 'string') {
    const businessId = extractBusinessId(req);

    const vendorPurchaseHistory = await getPurchaseHistoryWithVendor(
      new mongoose.Types.ObjectId(req.params['vendorId']),
      businessId
    );
    res.send(createSuccessResponse({ history: vendorPurchaseHistory }));
  }
});
