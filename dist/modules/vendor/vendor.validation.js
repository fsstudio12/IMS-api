"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendorSchema = exports.updateVendorSchema = exports.createVendorSchema = exports.getVendorSchema = exports.updateVendorBodySchema = exports.createVendorBodySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const enums_1 = require("../../config/enums");
exports.createVendorBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string().optional(),
    registrationType: joi_1.default.string()
        .valid(...Object.values(enums_1.RegistrationType))
        .optional(),
    registrationNumber: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
};
exports.updateVendorBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string().optional(),
    registrationType: joi_1.default.string()
        .valid(...Object.values(enums_1.RegistrationType))
        .optional(),
    registrationNumber: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
};
exports.getVendorSchema = {
    params: joi_1.default.object().keys({
        vendorId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.createVendorSchema = {
    body: joi_1.default.object().keys(exports.createVendorBodySchema),
};
exports.updateVendorSchema = {
    params: joi_1.default.object().keys({
        vendorId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.updateVendorBodySchema),
};
exports.deleteVendorSchema = {
    query: joi_1.default.object().keys({
        id: joi_1.default.string(),
    }),
};
//# sourceMappingURL=vendor.validation.js.map