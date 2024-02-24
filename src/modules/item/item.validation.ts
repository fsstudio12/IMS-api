import Joi from 'joi';
import { NewItem } from './item.interfaces';
import { objectId } from '../validate';

const combinationItemSchema: any = {
  _id: Joi.optional().custom(objectId),
  quantity: Joi.number().required(),
  quantityMetric: Joi.string().required(),
  price: Joi.number().required(),
};

const createItemBodySchema: Record<keyof NewItem, any> = {
  businessId: Joi.optional().custom(objectId),
  name: Joi.string().required(),
  quantity: Joi.number().required(),
  quantityMetric: Joi.string().required(),
  price: Joi.number().required(),
  isSellable: Joi.boolean().required(),
  isCombination: Joi.boolean().required(),
  combinationItems: Joi.object().keys(combinationItemSchema).optional(),
};

export const createItemSchema = {
  body: Joi.object().keys(createItemBodySchema),
};

export const getItemSchema = {
  query: Joi.object().keys({
    itemId: Joi.required().custom(objectId),
  }),
};
