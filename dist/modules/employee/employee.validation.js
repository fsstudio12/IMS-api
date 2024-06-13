"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeSchema = exports.updateEmployeeSchema = exports.getEmployeeSchema = exports.getEmployeesSchema = exports.createEmployeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const enums_1 = require("../../config/enums");
const createBodySchema = {
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.string().optional(),
    // password: Joi.string().required().custom(password),
    password: joi_1.default.string().required(),
    address: joi_1.default.string().optional(),
    departmentId: joi_1.default.string().custom(custom_validation_1.objectId).required(),
    enrollmentType: joi_1.default.string().valid(...Object.values(enums_1.EnrollmentType)),
    paySchedule: joi_1.default.string()
        .valid(...Object.values(enums_1.PaySchedule))
        .required(),
    payStartAt: joi_1.default.when('paySchedule', {
        is: joi_1.default.exist(),
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.string().optional().allow(''),
    }),
    wageType: joi_1.default.string().valid(...Object.values(enums_1.WageType)),
    salary: joi_1.default.number(),
    joinedAt: joi_1.default.when('enrollmentType', {
        is: joi_1.default.valid(enums_1.EnrollmentType.CONTRACT),
        then: joi_1.default.date().optional().allow(''),
        otherwise: joi_1.default.date().required(),
    }),
    contractStart: joi_1.default.when('enrollmentType', {
        is: joi_1.default.valid(enums_1.EnrollmentType.CONTRACT),
        then: joi_1.default.date().required(),
        otherwise: joi_1.default.string().empty('').allow(null).optional(),
    }),
    contractEnd: joi_1.default.when('enrollmentType', {
        is: joi_1.default.valid(enums_1.EnrollmentType.CONTRACT),
        then: joi_1.default.date().required(),
        otherwise: joi_1.default.string().empty('').allow(null).optional(),
    }),
};
const updateBodySchema = {
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().optional().email(),
    phone: joi_1.default.string().optional(),
    password: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    departmentId: joi_1.default.string().custom(custom_validation_1.objectId).optional(),
    enrollmentType: joi_1.default.string()
        .valid(...Object.values(enums_1.EnrollmentType))
        .optional(),
    paySchedule: joi_1.default.string()
        .valid(...Object.values(enums_1.PaySchedule))
        .optional(),
    payStartAt: joi_1.default.when('paySchedule', {
        is: joi_1.default.exist(),
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.string().optional().allow(''),
    }),
    wageType: joi_1.default.string()
        .valid(...Object.values(enums_1.WageType))
        .optional(),
    salary: joi_1.default.number().optional(),
    joinedAt: joi_1.default.when('enrollmentType', {
        is: joi_1.default.valid(enums_1.EnrollmentType.CONTRACT),
        then: joi_1.default.date().optional().allow(''),
        otherwise: joi_1.default.date().required(),
    }),
    contractStart: joi_1.default.when('enrollmentType', {
        is: joi_1.default.exist(),
        then: joi_1.default.when(joi_1.default.ref('enrollmentType'), {
            is: enums_1.EnrollmentType.CONTRACT,
            then: joi_1.default.date().required(),
            otherwise: joi_1.default.date().optional().allow(null),
        }),
        otherwise: joi_1.default.date().optional().allow(null),
    }),
    contractEnd: joi_1.default.when('enrollmentType', {
        is: joi_1.default.exist(),
        then: joi_1.default.when(joi_1.default.ref('enrollmentType'), {
            is: enums_1.EnrollmentType.CONTRACT,
            then: joi_1.default.date().required(),
            otherwise: joi_1.default.date().optional().allow(null),
        }),
        otherwise: joi_1.default.date().optional().allow(null),
    }),
};
exports.createEmployeeSchema = {
    body: joi_1.default.object().keys(createBodySchema),
};
exports.getEmployeesSchema = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        projectBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getEmployeeSchema = {
    params: joi_1.default.object().keys({
        employeeId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updateEmployeeSchema = {
    params: joi_1.default.object().keys({
        employeeId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object().keys(updateBodySchema).min(1),
};
exports.deleteEmployeeSchema = {
    params: joi_1.default.object().keys({
        employeeId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
//# sourceMappingURL=employee.validation.js.map