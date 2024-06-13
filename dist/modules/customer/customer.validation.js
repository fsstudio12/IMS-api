"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerSchema = exports.updateCustomerSchema = exports.createCustomerSchema = exports.getCustomerSchema = exports.customerBodySchema = exports.addressBodySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const enums_1 = require("../../config/enums");
exports.addressBodySchema = {
    location: joi_1.default.string().optional(),
    city: joi_1.default.string().optional(),
    region: joi_1.default.string().optional(),
    country: joi_1.default.string().optional(),
};
exports.customerBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string().required(),
    image: joi_1.default.string().optional().allow(''),
    type: joi_1.default.string()
        .valid(...Object.values(enums_1.CustomerType))
        .required(),
    registrationType: joi_1.default.string().valid(enums_1.RegistrationType.PAN, enums_1.RegistrationType.VAT, null, ''),
    registrationNumber: joi_1.default.string().allow('').optional(),
    address: joi_1.default.object().keys(exports.addressBodySchema).optional(),
};
exports.getCustomerSchema = {
    params: joi_1.default.object().keys({
        customerId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.createCustomerSchema = {
    body: joi_1.default.object().keys(exports.customerBodySchema),
};
exports.updateCustomerSchema = {
    params: joi_1.default.object().keys({
        customerId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.customerBodySchema),
};
exports.deleteCustomerSchema = {
    query: joi_1.default.object().keys({
        customerId: joi_1.default.string(),
    }),
};
//# sourceMappingURL=customer.validation.js.map