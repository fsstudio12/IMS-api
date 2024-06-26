import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync, extractBusinessId } from '../utils';
import * as purchaseService from './purchase.service';
import createSuccessResponse from '../success/SuccessResponse';
import { ApiError } from '../errors';

export const createPurchaseHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const purchase = await purchaseService.createPurchase({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse(purchase));
});

export const getPurchasesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const purchases = await purchaseService.getPurchasesByBusinessId(businessId);
  res.send(createSuccessResponse({ purchases }));
});

export const getPurchaseHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const purchase = await purchaseService.findPurchaseById(new mongoose.Types.ObjectId(req.params['purchaseId']));
    if (!purchase) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found.');

    res.send(createSuccessResponse(purchase));
  }
});

export const updatePurchaseHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const businessId = extractBusinessId(req);

    const purchase = await purchaseService.updatePurchaseById(new mongoose.Types.ObjectId(req.params['purchaseId']), {
      ...req.body,
      businessId,
    });

    res.send(createSuccessResponse(purchase));
  }
});

export const addPurchasePaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const purchase = await purchaseService.addPurchasePayment(
      new mongoose.Types.ObjectId(req.params['purchaseId']),
      req.body
    );
    res.send(createSuccessResponse(purchase));
  }
});

export const updatePurchasePaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string' && typeof req.params['paymentId'] === 'string') {
    const purchase = await purchaseService.updatePurchasePayment(
      new mongoose.Types.ObjectId(req.params['purchaseId']),
      new mongoose.Types.ObjectId(req.params['paymentId']),
      req.body
    );
    res.send(createSuccessResponse(purchase));
  }
});

export const removePurchasePaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string' && typeof req.params['paymentId'] === 'string') {
    const purchase = await purchaseService.removePurchasePayment(
      new mongoose.Types.ObjectId(req.params['purchaseId']),
      new mongoose.Types.ObjectId(req.params['paymentId'])
    );
    res.send(createSuccessResponse(purchase));
  }
});

export const deletePurchaseHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const businessId = extractBusinessId(req);
    await purchaseService.deletePurchase(req.params['purchaseId'], businessId);
    res.send(createSuccessResponse());
  }
});
