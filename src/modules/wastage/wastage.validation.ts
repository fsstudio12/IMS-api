import Joi from 'joi';
import { NewWastage } from './wastage.interfaces';
import { objectId } from '../validate';
import { requestCombinationItemSchema } from '../item/item.validation';

const createWastageBodySchema: Record<keyof NewWastage, any> = {
  date: Joi.string(),
  description: Joi.string(),
  items: Joi.array().items(Joi.object().keys(requestCombinationItemSchema)).optional(),
};

const updateWastageBodySchema: Record<keyof NewWastage, any> = {
  date: Joi.string().optional(),
  description: Joi.string().optional(),
  items: Joi.array().items(Joi.object().keys(requestCombinationItemSchema)).optional(),
};

export const getWastageSchema = {
  params: Joi.object().keys({
    wastageId: Joi.string().custom(objectId),
  }),
};

export const createWastageSchema = {
  body: Joi.object().keys(createWastageBodySchema),
};

export const updateWastageSchema = {
  params: Joi.object().keys({
    wastageId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(updateWastageBodySchema),
};

export const deleteWastageSchema = {
  params: Joi.object().keys({
    wastageId: Joi.string().custom(objectId),
  }),
};
