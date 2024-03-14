import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { catchAsync, extractBusinessId } from '../utils';
import {
  createAdminDepartmentForBusiness,
  createDepartment,
  deleteDepartmentsById,
  findDepartmentById,
  getDepartmentsByBusinessId,
  updateDepartmentById,
} from './department.service';
import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

export const getDepartmentsHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const departments = await getDepartmentsByBusinessId(businessId);
  res.send(createSuccessResponse({ departments }));
});

export const getDepartmentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['departmentId'] === 'string') {
    const department = await findDepartmentById(new mongoose.Types.ObjectId(req.params['departmentId']));
    if (!department) throw new ApiError(httpStatus.NOT_FOUND, 'Department not found.');
    res.send(createSuccessResponse({ department }));
  }
});

export const createDepartmentHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const department = await createDepartment({ ...req.body, businessId }, null);
  res.status(httpStatus.CREATED).send(createSuccessResponse({ department }));
});

export const updateDepartmentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['departmentId'] === 'string') {
    const businessId = extractBusinessId(req);
    const department = await updateDepartmentById(new mongoose.Types.ObjectId(req.params['departmentId']), {
      ...req.body,
      businessId,
    });
    res.status(httpStatus.OK).send(createSuccessResponse({ department }));
  }
});

export const deleteDepartmentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['departmentId'] === 'string') {
    await deleteDepartmentsById(req.query['departmentId']);
    res.send(createSuccessResponse());
  }
});

export const createBusinessAdminHandler = catchAsync(async (req: Request, res: Response) => {
  const { businessId } = req.body;
  const adminDepartment = await createAdminDepartmentForBusiness(new mongoose.Types.ObjectId(businessId), null);
  res.send(createSuccessResponse({ adminDepartment }));
});
