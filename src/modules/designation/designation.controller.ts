import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { catchAsync, extractBusinessId } from '../utils';
import { findDesignationById, getDesignationsByBusinessId } from './designation.service';
import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

export const getDesignationsHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const designations = await getDesignationsByBusinessId(businessId);
  res.send(createSuccessResponse({ designations }));
});

export const getDesignationHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['designationId'] === 'string') {
    const designation = await findDesignationById(new mongoose.Types.ObjectId(req.params['designationId']));
    if (!designation) throw new ApiError(httpStatus.NOT_FOUND, 'Designation not found.');
    res.send(createSuccessResponse());
  }
});

export const createDesignationHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  res.send(businessId);
});
