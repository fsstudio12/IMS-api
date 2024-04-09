import Joi from 'joi';
import { INewPurchase, IPurchase } from './purchase.interfaces';
import { objectId } from '../validate';
import { itemValidation } from '../item';
import { PaymentStatus } from '../../config/enums';

export const getPurchaseSchema = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(objectId),
  }),
};

export const paymentSchema = {
  _id: Joi.custom(objectId).optional().allow(null, ''),
  title: Joi.string().optional(),
  name: Joi.string().optional(),
  amount: Joi.number(),
  method: Joi.string().optional().allow(null),
  date: Joi.string(),
};

const purchaseItemSchema = {
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

export const purchaseBodySchema: Record<keyof INewPurchase, any> = {
  businessId: Joi.optional().custom(objectId),
  vendorId: Joi.custom(objectId).required(),
  payment: Joi.object().keys(paymentSchema).optional(),
  date: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  items: Joi.array().items(Joi.object().keys(purchaseItemSchema)).min(1),
};

export const updatePurchaseBodySchema: Record<keyof IPurchase, any> = {
  businessId: Joi.optional().custom(objectId),
  vendorId: Joi.custom(objectId).required(),
  paymentInfo: Joi.object().keys(paymentInfoSchema),
  date: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  items: Joi.array().items(Joi.object().keys(purchaseItemSchema)).min(1),
};

export const createPurchaseSchema = {
  body: Joi.object().keys(purchaseBodySchema),
};

export const updatePurchaseSchema = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(updatePurchaseBodySchema),
};

export const deletePurchaseSchema = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(objectId),
  }),
};

export const addPurchasePaymentSchema = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(paymentSchema),
};

export const updatePurchasePaymentSchema = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(objectId),
    paymentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(paymentSchema),
};

export const deletePurchasePaymentSchema = {
  params: Joi.object().keys({
    purchaseId: Joi.string().custom(objectId),
    paymentId: Joi.string().custom(objectId),
  }),
};
