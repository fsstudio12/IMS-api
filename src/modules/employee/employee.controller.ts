import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { catchAsync } from '../utils';
import ApiError from '../errors/ApiError';
// import { IOptions } from '../paginate/paginate';
import * as employeeService from './employee.service';
import createSuccessResponse from '../success/SuccessResponse';
import { Role } from '../../config/enums';

export const createEmployeeHandler = catchAsync(async (req: Request, res: Response) => {
  const employee = await employeeService.createEmployee({
    ...req.body,
    role: Role.EMPLOYEE,
    businessId: req.employee.businessId,
  });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ employee }));
});

export const getEmployeesHandler = catchAsync(async (req: Request, res: Response) => {
  // const filter = pick(req.query, ['name', 'role']);
  // const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  // const result = await employeeService.queryEmployees(filter, options);
  // res.send(createSuccessResponse(result));
  res.send(createSuccessResponse({ employees: await employeeService.getEmployeesByRole(req.employee) }));
});

export const getEmployeeHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['employeeId'] === 'string') {
    const employee = await employeeService.findEmployeeById(new mongoose.Types.ObjectId(req.params['employeeId']));
    if (!employee) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');

    res.send(createSuccessResponse({ employee }));
  }
});

export const updateEmployeeHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['employeeId'] === 'string') {
    const employee = await employeeService.updateEmployeeById(
      new mongoose.Types.ObjectId(req.params['employeeId']),
      req.body
    );
    res.send(createSuccessResponse({ employee }));
  }
});

export const deleteEmployeeHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['employeeId'] === 'string') {
    await employeeService.deleteEmployeeById(new mongoose.Types.ObjectId(req.params['employeeId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
