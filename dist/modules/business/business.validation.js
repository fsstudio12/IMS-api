"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusinessSchema = exports.updateBusinessSchema = exports.getBusinessSchema = exports.getBusinessesSchema = exports.createBusinessSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const createBusinessBodySchema = {
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.string().optional(),
};
exports.createBusinessSchema = {
    body: joi_1.default.object().keys(createBusinessBodySchema),
};
exports.getBusinessesSchema = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
    }),
};
exports.getBusinessSchema = {
    query: joi_1.default.object().keys({
        businessId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.updateBusinessSchema = {
    params: joi_1.default.object().keys({
        businessId: joi_1.default.required().custom(validate_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        name: joi_1.default.string(),
        email: joi_1.default.string().email(),
    })
        .min(1),
};
exports.deleteBusinessSchema = {
    params: joi_1.default.object().keys({
        businessId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
//# sourceMappingURL=business.validation.js.map