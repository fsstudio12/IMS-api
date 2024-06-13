"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartmentSchema = exports.updateDepartmentSchema = exports.getDepartmentSchema = exports.createDepartmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const resources_1 = __importDefault(require("../../config/resources"));
const actions_1 = __importDefault(require("../../config/actions"));
// const permissionsSchema = Joi.object().keys(
//   Object.keys(Resource).reduce((acc, resourceKey) => {
//     const resource = Resource[resourceKey as keyof typeof Resource];
//     acc[resource] = Joi.array().items(Joi.string().valid(...Object.values(Action)));
//     return acc;
//   }, {} as Record<Resource, Joi.Schema>)
// );
// Define custom validation rule to check if all resources have at least one action
const validatePermissions = (value, helpers) => {
    if (!value || typeof value !== 'object') {
        return helpers.error('any.required');
    }
    const missingResources = Object.values(resources_1.default).filter((resource) => {
        // return !(resource in value) || value[resource].length === 0;
        return !(resource in value);
    });
    if (missingResources.length > 0) {
        return helpers.error(`Permissions for ${missingResources} is required.`);
    }
    return value;
};
const actionValidator = joi_1.default.string().valid(...Object.values(actions_1.default));
const permissionsSchema = joi_1.default.object()
    .keys(Object.keys(resources_1.default).reduce((acc, resourceKey) => {
    const resource = resources_1.default[resourceKey];
    acc[resource] = joi_1.default.array().items(actionValidator);
    return acc;
}, {}))
    .custom(validatePermissions);
const createDepartmentBodySchema = {
    title: joi_1.default.string().required(),
    permissions: permissionsSchema.required(),
};
exports.createDepartmentSchema = {
    body: joi_1.default.object().keys(createDepartmentBodySchema),
};
exports.getDepartmentSchema = {
    params: joi_1.default.object().keys({
        departmentId: joi_1.default.required().custom(validate_1.objectId),
    }),
};
exports.updateDepartmentSchema = {
    params: joi_1.default.object().keys({
        departmentId: joi_1.default.required().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(createDepartmentBodySchema).optional(),
};
exports.deleteDepartmentSchema = {
    query: joi_1.default.object().keys({
        departmentId: joi_1.default.string(),
    }),
};
//# sourceMappingURL=department.validation.js.map