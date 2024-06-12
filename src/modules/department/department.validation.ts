import Joi from 'joi';
import { NewDepartment } from './department.interfaces';
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
    // return !(resource in value) || value[resource].length === 0;
    return !(resource in value);
  });
  if (missingResources.length > 0) {
    return helpers.error(`Permissions for ${missingResources} is required.`);
  }
  return value;
};

const actionValidator = Joi.string().valid(...Object.values(Action));

const permissionsSchema = Joi.object()
  .keys(
    Object.keys(Resource).reduce((acc, resourceKey) => {
      const resource = Resource[resourceKey as keyof typeof Resource];
      acc[resource] = Joi.array().items(actionValidator);
      return acc;
    }, {} as Record<Resource, Joi.Schema>)
  )
  .custom(validatePermissions);

const createDepartmentBodySchema: Record<keyof NewDepartment, any> = {
  title: Joi.string().required(),
  permissions: permissionsSchema.required(),
};

export const createDepartmentSchema = {
  body: Joi.object().keys(createDepartmentBodySchema),
};

export const getDepartmentSchema = {
  params: Joi.object().keys({
    departmentId: Joi.required().custom(objectId),
  }),
};

export const updateDepartmentSchema = {
  params: Joi.object().keys({
    departmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys(createDepartmentBodySchema).optional(),
};

export const deleteDepartmentSchema = {
  query: Joi.object().keys({
    departmentId: Joi.string(),
  }),
};
