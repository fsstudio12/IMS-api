import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { catchAsync, extractBusinessId } from '../utils';
import {
  createDesignation,
  deleteDesignationsById,
  findDesignationById,
  getDesignationsByBusinessId,
  updateDesignationById,
} from './designation.service';
import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

export const getDesignationsHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  console.log('🚀 ~ getDesignationsHandler ~ businessId:', businessId);
  const designations = await getDesignationsByBusinessId(businessId);
  res.send(createSuccessResponse({ designations }));
});

export const getDesignationHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['designationId'] === 'string') {
    const designation = await findDesignationById(new mongoose.Types.ObjectId(req.params['designationId']));
    if (!designation) throw new ApiError(httpStatus.NOT_FOUND, 'Designation not found.');
    res.send(createSuccessResponse({ designation }));
  }
});

export const createDesignationHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const designation = await createDesignation({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ designation }));
});

export const updateDesignationHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['designationId'] === 'string') {
    const businessId = extractBusinessId(req);
    const designation = await updateDesignationById(new mongoose.Types.ObjectId(req.params['designationId']), {
      ...req.body,
      businessId,
    });
    res.status(httpStatus.OK).send(createSuccessResponse({ designation }));
  }
});

export const deleteDesignationHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['designationId'] === 'string') {
    await deleteDesignationsById(req.query['designationId']);
    res.send(createSuccessResponse());
  }
});
