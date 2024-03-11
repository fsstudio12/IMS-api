import Joi from 'joi';
import { NewDesignation } from './designation.interfaces';
import { objectId } from '../validate';
import Resource from '../../config/resources';
import Action from '../../config/actions';

// const permissionsSchema = {
//   resource: Joi.string().valid(
//     Resource.ANALYTICS,
//     Resource.DEPARTMENTS,
//     Resource.EMPLOYEES,
//     Resource.INVENTORY,
//     Resource.PAYROLL,
//     Resource.PURCHASES,
//     Resource.RAW_ITEMS,
//     Resource.RECIPES,
//     Resource.SALES,
//     Resource.SETTINGS,
//     Resource.VENDORS,
//     Resource.WASTAGE
//   ),
//   action: Joi.array().items(Joi.string().valid(Action.CREATE, Action.VIEW, Action.EDIT, Action.REMOVE, Action.ALL)),
// };

const createDesignationBodySchema: Record<keyof NewDesignation, any> = {
  name: Joi.string().required(),
  permissions: Joi.object()
    .pattern(
      Joi.string().valid(
        Resource.ANALYTICS,
        Resource.DEPARTMENTS,
        Resource.EMPLOYEES,
        Resource.INVENTORY,
        Resource.PAYROLL,
        Resource.PURCHASES,
        Resource.RAW_ITEMS,
        Resource.RECIPES,
        Resource.SALES,
        Resource.SETTINGS,
        Resource.VENDORS,
        Resource.WASTAGE
      ),
      Joi.array().items(Joi.string().valid(Action.CREATE, Action.VIEW, Action.EDIT, Action.REMOVE, Action.ALL))
    )
    .required(),
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
  body: Joi.object().keys(createDesignationBodySchema),
};

export const deleteDesignationSchema = {
  params: Joi.object().keys({
    designationId: Joi.required().custom(objectId),
  }),
};
