import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedEmployee } from './employee.interfaces';

const createEmployeeBodySchema: Record<keyof NewCreatedEmployee, any> = {
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  // password: Joi.string().required().custom(password),
  password: Joi.string().required(),
  role: Joi.string().required().valid('employee', 'admin'),
  phone: Joi.string().optional(),
};

export const createEmployeeSchema = {
  body: Joi.object().keys(createEmployeeBodySchema),
};

export const getEmployeesSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getEmployeeSchema = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId),
  }),
};

export const updateEmployeeSchema = {
  params: Joi.object().keys({
    employeeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      // password: Joi.string().custom(password),
      password: Joi.string(),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteEmployeeSchema = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId),
  }),
};
