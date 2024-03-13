import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, extractBusinessId } from '../utils';

import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

import * as customerService from './customer.service';

export const getCustomersHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const customers = await customerService.findCustomersByFilterQuery({ businessId });
  res.send(createSuccessResponse({ customers }));
});

export const getCustomerHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    const customer = await customerService.findCustomerById(new mongoose.Types.ObjectId(req.params['customerId']));
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found.');

    res.send(createSuccessResponse({ customer }));
  }
});

export const createCustomerHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const customer = await customerService.createCustomer({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ customer }));
});

export const updateCustomerHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    const businessId = extractBusinessId(req);

    const customer = await customerService.updateCustomerById(new mongoose.Types.ObjectId(req.params['customerId']), {
      ...req.body,
      businessId,
    });

    res.status(httpStatus.OK).send(createSuccessResponse({ customer }));
  }
});

export const deleteCustomerHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    await customerService.deleteCustomersById(req.params['customerId'], req.employee.businessId);
    res.send(createSuccessResponse());
  }
});
