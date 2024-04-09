import Joi from 'joi';
import { objectId } from '../validate';
import { paymentSchema } from '../purchase/purchase.validation';

export const eachUtilitySchema = {
  _id: Joi.custom(objectId),
  title: Joi.string().optional(),
  payments: Joi.array().items(Joi.object().keys(paymentSchema)),
};

export const utilityPaymentPayloadSchema = {
  title: Joi.string(),
  date: Joi.date().optional(),
  from: Joi.date(),
  to: Joi.date(),
  utilities: Joi.array().items(Joi.object().keys(eachUtilitySchema)),
};

export const getUtilityPaymentSchema = {
  params: Joi.object().keys({
    utilityPaymentId: Joi.custom(objectId),
  }),
};

export const createUtilityPaymentPayloadSchema = {
  body: Joi.object().keys(utilityPaymentPayloadSchema),
};

export const updateUtilityPaymentPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(utilityPaymentPayloadSchema),
};

export const updateSingleUtilityPaymentPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
    paymentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(paymentSchema),
};

export const deleteUtilityPaymentSchema = {
  params: Joi.object().keys({
    utilityPaymentId: Joi.custom(objectId),
  }),
};
