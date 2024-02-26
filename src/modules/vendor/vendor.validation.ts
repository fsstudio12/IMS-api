import Joi from 'joi';
import { NewVendor } from './vendor.interfaces';
import { objectId } from '../validate';
import { RegistrationType } from '../../config/enums';

export const vendorBodySchema: Record<keyof NewVendor, any> = {
  businessId: Joi.optional().custom(objectId),
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  registrationType: Joi.string()
    .valid(...Object.values(RegistrationType))
    .optional(),
  registrationNumber: Joi.string().optional(),
  address: Joi.string(),
};

export const getVendorSchema = {
  params: Joi.object().keys({
    vendorId: Joi.string().custom(objectId),
  }),
};

export const createVendorSchema = {
  body: Joi.object().keys(vendorBodySchema),
};

export const updateVendorSchema = {
  params: Joi.object().keys({
    vendorId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(vendorBodySchema),
};

export const deleteVendorSchema = {
  query: Joi.object().keys({
    vendorId: Joi.string(),
  }),
};
