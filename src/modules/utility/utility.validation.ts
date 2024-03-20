import Joi from 'joi';
import { objectId } from '../validate';

const utilityPayloadSchema = {
  title: Joi.string(),
};

export const getUtilityPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
  }),
};

export const createUtilityPayloadSchema = {
  body: Joi.object().keys(utilityPayloadSchema),
};

export const updateUtilityPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    ...createUtilityPayloadSchema,
  }),
};

export const deleteUtilityPayloadSchema = {
  params: Joi.object().keys({
    utilityId: Joi.string().custom(objectId),
  }),
};
