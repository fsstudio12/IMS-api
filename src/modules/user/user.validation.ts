import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBodySchema: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  // password: Joi.string().required().custom(password),
  password: Joi.string().required(),
  name: Joi.string().required(),
  role: Joi.string().required().valid('employee', 'admin'),
};

export const createUserSchema = {
  body: Joi.object().keys(createUserBodySchema),
};

export const getUsersSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUserSchema = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
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

export const deleteUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
