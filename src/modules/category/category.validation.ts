import Joi from 'joi';
import { NewCategory } from './category.interfaces';
import { objectId } from '../validate';

const createCategoryBodySchema: Record<keyof NewCategory, any> = {
  name: Joi.string().required(),
};

export const createCategorySchema = {
  body: Joi.object().keys(createCategoryBodySchema),
};

export const getCategoriesSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getCategorySchema = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
};

export const updateCategorySchema = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

export const deleteCategorySchema = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
};
