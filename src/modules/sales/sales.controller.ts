import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync, extractBusinessId } from '../utils';
import * as salesService from './sales.service';
import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

export const createSalesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const sales = await salesService.createSales({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ sales }));
});

export const getSalesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const sales = await salesService.getSalesByBusinessId(businessId);
  res.send(createSuccessResponse({ sales }));
});

export const getSingleSalesHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['salesId'] === 'string') {
    const sales = await salesService.findSalesById(new mongoose.Types.ObjectId(req.params['salesId']));
    if (!sales) throw new ApiError(httpStatus.NOT_FOUND, 'Sales not found.');

    res.send(createSuccessResponse({ sales }));
  }
});

export const updateSalesHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['salesId'] === 'string') {
    const businessId = extractBusinessId(req);

    const sales = await salesService.updateSalesById(new mongoose.Types.ObjectId(req.params['salesId']), {
      ...req.body,
      businessId,
    });

    res.send(createSuccessResponse({ sales }));
  }
});

export const addSalesPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['salesId'] === 'string') {
    const sales = await salesService.addSalesPayment(new mongoose.Types.ObjectId(req.params['salesId']), req.body);
    res.send(createSuccessResponse({ sales }));
  }
});

export const updateSalesPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['salesId'] === 'string' && typeof req.params['paymentId'] === 'string') {
    const sales = await salesService.updateSalesPayment(
      new mongoose.Types.ObjectId(req.params['salesId']),
      new mongoose.Types.ObjectId(req.params['paymentId']),
      req.body
    );
    res.send(createSuccessResponse({ sales }));
  }
});

export const removeSalesPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['salesId'] === 'string' && typeof req.params['paymentId'] === 'string') {
    const sales = await salesService.removeSalesPayment(
      new mongoose.Types.ObjectId(req.params['salesId']),
      new mongoose.Types.ObjectId(req.params['paymentId'])
    );
    res.send(createSuccessResponse({ sales }));
  }
});

export const deleteSalesHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['salesId'] === 'string') {
    await salesService.deleteSales(req.params['salesId'], req.user.businessId);
    res.send(createSuccessResponse());
  }
});
