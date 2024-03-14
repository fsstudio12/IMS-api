import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { CreateEmployeePayload } from './employee.interfaces';
import { EnrollmentType, PaySchedule, WageType } from '../../config/enums';

const createBodySchema: Record<keyof CreateEmployeePayload, any> = {
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  phone: Joi.string().optional(),
  // password: Joi.string().required().custom(password),
  password: Joi.string().required(),
  address: Joi.string().optional(),
  departmentId: Joi.string().custom(objectId).required(),
  enrollmentType: Joi.string().valid(...Object.values(EnrollmentType)),
  paySchedule: Joi.string()
    .valid(...Object.values(PaySchedule))
    .required(),
  payStartAt: Joi.when('paySchedule', {
    is: Joi.exist(),
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(''),
  }),
  wageType: Joi.string().valid(...Object.values(WageType)),
  salary: Joi.number(),
  joinedAt: Joi.when('enrollmentType', {
    is: Joi.valid(EnrollmentType.CONTRACT),
    then: Joi.date().optional().allow(''),
    otherwise: Joi.date().required(),
  }),
  contractStart: Joi.when('enrollmentType', {
    is: Joi.valid(EnrollmentType.CONTRACT),
    then: Joi.date().required(),
    otherwise: Joi.string().empty('').allow(null).optional(),
  }),
  contractEnd: Joi.when('enrollmentType', {
    is: Joi.valid(EnrollmentType.CONTRACT),
    then: Joi.date().required(),
    otherwise: Joi.string().empty('').allow(null).optional(),
  }),
};

const updateBodySchema: Record<keyof CreateEmployeePayload, any> = {
  name: Joi.string().optional(),
  email: Joi.string().optional().email(),
  phone: Joi.string().optional(),
  password: Joi.string().optional(), // Optional for update
  address: Joi.string().optional(),
  departmentId: Joi.string().custom(objectId).optional(),
  enrollmentType: Joi.string()
    .valid(...Object.values(EnrollmentType))
    .optional(),
  paySchedule: Joi.string()
    .valid(...Object.values(PaySchedule))
    .optional(),
  payStartAt: Joi.when('paySchedule', {
    is: Joi.exist(),
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(''),
  }),
  wageType: Joi.string()
    .valid(...Object.values(WageType))
    .optional(),
  salary: Joi.number().optional(),
  joinedAt: Joi.when('enrollmentType', {
    is: Joi.valid(EnrollmentType.CONTRACT),
    then: Joi.date().optional().allow(''),
    otherwise: Joi.date().required(),
  }),
  contractStart: Joi.when('enrollmentType', {
    is: Joi.exist(),
    then: Joi.when(Joi.ref('enrollmentType'), {
      is: EnrollmentType.CONTRACT,
      then: Joi.date().required(),
      otherwise: Joi.date().optional().allow(null),
    }),
    otherwise: Joi.date().optional().allow(null),
  }),
  contractEnd: Joi.when('enrollmentType', {
    is: Joi.exist(),
    then: Joi.when(Joi.ref('enrollmentType'), {
      is: EnrollmentType.CONTRACT,
      then: Joi.date().required(),
      otherwise: Joi.date().optional().allow(null),
    }),
    otherwise: Joi.date().optional().allow(null),
  }),
};

export const createEmployeeSchema = {
  body: Joi.object().keys(createBodySchema),
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
  body: Joi.object().keys(updateBodySchema).min(1),
};

export const deleteEmployeeSchema = {
  params: Joi.object().keys({
    employeeId: Joi.string().custom(objectId),
  }),
};
