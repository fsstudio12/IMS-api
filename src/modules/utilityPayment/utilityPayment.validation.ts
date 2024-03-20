import Joi from 'joi';
import { objectId } from '../validate';

export const utilityPaymentPayloadSchema = {
  _id: Joi.custom(objectId).optional().allow(null, ''),
  title: Joi.string().optional(),
  name: Joi.string().optional(),
  amount: Joi.number(),
  method: Joi.string().optional().allow(null),
  date: Joi.date().optional(),
  from: Joi.date(),
  to: Joi.date(),
};

export const utilityPayloadSchema = {
  title: Joi.string(),
};

export const createUtilityPayloadSchema = {
  body: Joi.object().keys(utilityPayloadSchema),
};

export const createUtilityPaymentPayloadSchema = {
  body: Joi.object().keys(utilityPaymentPayloadSchema),
};

export const updateUtilityPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    ...createUtilityPayloadSchema,
    payments: Joi.array().items(Joi.object().keys(utilityPaymentPayloadSchema)),
  }),
};

export const updateUtilityPaymentPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
    paymentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    ...createUtilityPaymentPayloadSchema,
  }),
};
