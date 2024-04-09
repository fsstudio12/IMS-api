import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, extractBusinessId } from '../utils';
import createSuccessResponse from '../success/SuccessResponse';
import {
  createUtilityPayment,
  deleteUtilityPaymentsById,
  findUtilityPaymentByIdAndBusinessId,
  findUtilityPaymentsByFilterQuery,
  updateUtilityPaymentById,
} from './utilityPayment.service';

export const getUtilityPaymentsHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const utilityPayments = await findUtilityPaymentsByFilterQuery({ businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ utilityPayments }));
});

export const getUtilityPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['utilityPaymentId'] === 'string') {
    const businessId = extractBusinessId(req);
    const utilityPayment = await findUtilityPaymentByIdAndBusinessId(
      new mongoose.Types.ObjectId(req.params['utilityPaymentId']),
      businessId
    );
    res.status(httpStatus.CREATED).send(createSuccessResponse({ utilityPayment }));
  }
});

export const createUtilityPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const utilityPayment = await createUtilityPayment({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ utilityPayment }));
});

export const updateUtilityPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['utilityId'] === 'string') {
    const businessId = extractBusinessId(req);
    const utilityPayment = await updateUtilityPaymentById(new mongoose.Types.ObjectId(req.params['utilityPaymentId']), {
      ...req.body,
      businessId,
    });
    res.status(httpStatus.OK).send(createSuccessResponse({ utilityPayment }));
  }
});

export const deleteUtilityPaymentsHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['utilityPaymentId'] === 'string') {
    const businessId = extractBusinessId(req);
    await deleteUtilityPaymentsById(req.query['utilityPaymentId'], businessId);
    res.status(httpStatus.CREATED).send(createSuccessResponse());
  }
});
