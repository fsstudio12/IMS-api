import Joi from 'joi';
import { NewRecipe } from './recipe.interfaces';
import { objectId } from '../validate';
import { requestCombinationItemSchema } from '../item/item.validation';

export const getRecipeSchema = {
  params: Joi.object().keys({
    recipeId: Joi.string().custom(objectId),
  }),
};

const createRecipeBodySchema: Record<keyof NewRecipe, any> = {
  businessId: Joi.optional().custom(objectId),
  name: Joi.string().required(),
  quantity: Joi.number().required(),
  quantityMetric: Joi.string().required(),
  price: Joi.number().required(),
  combinationItems: Joi.array().items(Joi.object().keys(requestCombinationItemSchema)).optional(),
};

export const createRecipeSchema = {
  body: Joi.object().keys(createRecipeBodySchema),
};

export const updateRecipeSchema = {
  params: Joi.object().keys({
    recipeId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(createRecipeBodySchema),
};

export const deleteRecipeSchema = {
  query: Joi.object().keys({
    recipeId: Joi.string(),
  }),
};
