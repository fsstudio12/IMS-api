import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';

import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

import * as customerService from './customer.service';

export const getCustomersHandler = catchAsync(async (req: Request, res: Response) => {
  const { businessId } = req.user;

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
  const businessId = req.user.businessId ? req.user.businessId : new mongoose.Types.ObjectId(req.body.businessId);
  if (!businessId) throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');

  const customer = await customerService.createCustomer({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ customer }));
});

export const updateCustomerHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    const businessId = req.user.businessId ? req.user.businessId : new mongoose.Types.ObjectId(req.body.businessId);
    if (!businessId) throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');

    const customer = await customerService.updateCustomerById(new mongoose.Types.ObjectId(req.params['customerId']), {
      ...req.body,
      businessId,
    });

    res.status(httpStatus.OK).send(createSuccessResponse({ customer }));
  }
});

export const deleteCustomerHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    await customerService.deleteCustomerById(req.params['customerId'], req.user.businessId);
    res.send(createSuccessResponse());
  }
});
