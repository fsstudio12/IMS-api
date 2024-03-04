import Joi from 'joi';
import { NewCustomer } from './customer.interfaces';
import { objectId } from '../validate';
import { CustomerType, RegistrationType } from '../../config/enums';

export const addressBodySchema = {
  location: Joi.string().optional(),
  city: Joi.string().optional(),
  region: Joi.string().optional(),
  country: Joi.string().optional(),
};

export const customerBodySchema: Record<keyof NewCustomer, any> = {
  businessId: Joi.optional().custom(objectId),
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().required(),
  image: Joi.string().optional().allow(''),
  type: Joi.string()
    .valid(...Object.values(CustomerType))
    .required(),
  registrationType: Joi.string().valid(RegistrationType.PAN, RegistrationType.VAT, null, ''),
  registrationNumber: Joi.string().allow('').optional(),
  address: Joi.object().keys(addressBodySchema).optional(),
};

export const getCustomerSchema = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

export const createCustomerSchema = {
  body: Joi.object().keys(customerBodySchema),
};

export const updateCustomerSchema = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(customerBodySchema),
};

export const deleteCustomerSchema = {
  query: Joi.object().keys({
    customerId: Joi.string(),
  }),
};
