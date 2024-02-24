import Joi from 'joi';
import { NewBusiness } from './business.interfaces';
import { objectId } from '../validate';

const createBusinessBodySchema: Record<keyof NewBusiness, any> = {
  name: Joi.string().required(),
  email: Joi.string().required().email(),
};

export const createBusinessSchema = {
  body: Joi.object().keys(createBusinessBodySchema),
};

export const getBusinessesSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

export const getBusinessSchema = {
  query: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
};

export const updateBusinessSchema = {
  params: Joi.object().keys({
    businessId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
    })
    .min(1),
};

export const deleteBusinessSchema = {
  params: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
};
