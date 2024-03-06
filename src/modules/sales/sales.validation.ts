import Joi from 'joi';
import { INewSales, ISales } from './sales.interfaces';
import { objectId } from '../validate';
import { itemValidation } from '../item';
import { PaymentStatus } from '../../config/enums';

export const getSalesSchema = {
  params: Joi.object().keys({
    salesId: Joi.string().custom(objectId),
  }),
};

const paymentSchema = {
  _id: Joi.custom(objectId).optional().allow(null, ''),
  amount: Joi.number(),
  method: Joi.string().optional().allow(null),
  date: Joi.string(),
};

const salesItemSchema = {
  ...itemValidation.requestCombinationItemSchema,
  price: Joi.number().required(),
};

const paymentInfoSchema = {
  status: Joi.string()
    .valid(...Object.values(PaymentStatus))
    .optional(),
  total: Joi.number().optional(),
  paid: Joi.number().optional(),
  remaining: Joi.number().optional(),
  payments: Joi.array().items(Joi.object().keys(paymentSchema)),
};

export const salesBodySchema: Record<keyof INewSales, any> = {
  businessId: Joi.optional().custom(objectId),
  customerId: Joi.custom(objectId).required(),
  payment: Joi.object().keys(paymentSchema).optional(),
  date: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  items: Joi.array().items(Joi.object().keys(salesItemSchema)).min(1),
};

export const updateSalesBodySchema: Record<keyof ISales, any> = {
  businessId: Joi.optional().custom(objectId),
  customerId: Joi.custom(objectId).required(),
  paymentInfo: Joi.object().keys(paymentInfoSchema),
  date: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  items: Joi.array().items(Joi.object().keys(salesItemSchema)).min(1),
};

export const createSalesSchema = {
  body: Joi.object().keys(salesBodySchema),
};

export const updateSalesSchema = {
  params: Joi.object().keys({
    salesId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(updateSalesBodySchema),
};

export const deleteSalesSchema = {
  params: Joi.object().keys({
    salesId: Joi.string().custom(objectId),
  }),
};

export const addSalesPaymentSchema = {
  params: Joi.object().keys({
    salesId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(paymentSchema),
};

export const updateSalesPaymentSchema = {
  params: Joi.object().keys({
    salesId: Joi.string().custom(objectId),
    paymentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(paymentSchema),
};

export const deleteSalesPaymentSchema = {
  params: Joi.object().keys({
    salesId: Joi.string().custom(objectId),
    paymentId: Joi.string().custom(objectId),
  }),
};
