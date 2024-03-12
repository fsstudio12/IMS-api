import Joi from 'joi';
import { NewDesignation } from './designation.interfaces';
import { objectId } from '../validate';
import Resource from '../../config/resources';
import Action from '../../config/actions';

// const permissionsSchema = Joi.object().keys(
//   Object.keys(Resource).reduce((acc, resourceKey) => {
//     const resource = Resource[resourceKey as keyof typeof Resource];
//     acc[resource] = Joi.array().items(Joi.string().valid(...Object.values(Action)));
//     return acc;
//   }, {} as Record<Resource, Joi.Schema>)
// );
// Define custom validation rule to check if all resources have at least one action
const validatePermissions = (value: any, helpers: Joi.CustomHelpers<any>) => {
  if (!value || typeof value !== 'object') {
    return helpers.error('any.required');
  }
  const missingResources = Object.values(Resource).filter((resource) => {
    return !(resource in value) || value[resource].length === 0;
  });
  if (missingResources.length > 0) {
    return helpers.error(`Permissions for ${missingResources} is required.`);
  }
  return value;
};

const permissionsSchema = Joi.object()
  .keys(
    Object.keys(Resource).reduce((acc, resourceKey) => {
      const resource = Resource[resourceKey as keyof typeof Resource];
      acc[resource] = Joi.array().items(Joi.string().valid(...Object.values(Action)));
      return acc;
    }, {} as Record<Resource, Joi.Schema>)
  )
  .custom(validatePermissions);

const createDesignationBodySchema: Record<keyof NewDesignation, any> = {
  name: Joi.string().required(),
  permissions: permissionsSchema.required(),
};

export const createDesignationSchema = {
  body: Joi.object().keys(createDesignationBodySchema),
};

export const getDesignationSchema = {
  params: Joi.object().keys({
    designationId: Joi.required().custom(objectId),
  }),
};

export const updateDesignationSchema = {
  params: Joi.object().keys({
    designationId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys(createDesignationBodySchema).optional(),
};

export const deleteDesignationSchema = {
  query: Joi.object().keys({
    designationId: Joi.string(),
  }),
};
