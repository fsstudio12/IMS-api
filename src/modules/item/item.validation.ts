import Joi from 'joi';
import { NewItem } from './item.interfaces';
import { objectId } from '../validate';

export const getItemSchema = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

export const requestCombinationItemSchema: any = {
  _id: Joi.optional().custom(objectId),
  quantity: Joi.number().required(),
  quantityMetric: Joi.string().required(),
};

const createItemBodySchema: Record<keyof NewItem, any> = {
  businessId: Joi.optional().custom(objectId),
  name: Joi.string().required(),
  quantity: Joi.number().required(),
  quantityMetric: Joi.string().required(),
  price: Joi.number().required(),
  isSellable: Joi.boolean().required(),
  isCombination: Joi.boolean().required(),
  combinationItems: Joi.array().items(Joi.object().keys(requestCombinationItemSchema)).optional(),
};

export const createItemSchema = {
  body: Joi.object().keys(createItemBodySchema),
};

export const updateItemSchema = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(createItemBodySchema),
};

export const deleteItemSchema = {
  query: Joi.object().keys({
    itemId: Joi.string(),
  }),
};