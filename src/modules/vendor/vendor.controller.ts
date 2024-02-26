import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';

import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

import * as vendorService from './vendor.service';

export const getVendorsHandler = catchAsync(async (req: Request, res: Response) => {
  const { businessId } = req.user;

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
  const businessId = req.user.businessId ? req.user.businessId : new mongoose.Types.ObjectId(req.body.businessId);
  if (!businessId) throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');

  const vendor = await vendorService.createVendor({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ vendor }));
});

export const updateVendorHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['vendorId'] === 'string') {
    const businessId = req.user.businessId ? req.user.businessId : new mongoose.Types.ObjectId(req.body.businessId);
    if (!businessId) throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');

    const vendor = await vendorService.updateVendorById(new mongoose.Types.ObjectId(req.params['vendorId']), {
      ...req.body,
      businessId,
    });

    res.status(httpStatus.OK).send(createSuccessResponse({ vendor }));
  }
});

export const deleteVendorHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['vendorId'] === 'string') {
    await vendorService.deleteVendorById(req.params['vendorId'], req.user.businessId);
    res.send(createSuccessResponse());
  }
});
