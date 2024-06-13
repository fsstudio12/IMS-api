"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUtilityPaymentSchema = exports.updateSingleUtilityPaymentPayloadSchema = exports.updateUtilityPaymentPayloadSchema = exports.createUtilityPaymentPayloadSchema = exports.getUtilityPaymentSchema = exports.utilityPaymentPayloadSchema = exports.eachUtilitySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const purchase_validation_1 = require("../purchase/purchase.validation");
exports.eachUtilitySchema = {
    _id: joi_1.default.custom(validate_1.objectId),
    title: joi_1.default.string().optional(),
    payments: joi_1.default.array().items(joi_1.default.object().keys(purchase_validation_1.paymentSchema)),
};
exports.utilityPaymentPayloadSchema = {
    title: joi_1.default.string(),
    date: joi_1.default.date().optional(),
    from: joi_1.default.date(),
    to: joi_1.default.date(),
    utilities: joi_1.default.array().items(joi_1.default.object().keys(exports.eachUtilitySchema)),
};
exports.getUtilityPaymentSchema = {
    params: joi_1.default.object().keys({
        utilityPaymentId: joi_1.default.custom(validate_1.objectId),
    }),
};
exports.createUtilityPaymentPayloadSchema = {
    body: joi_1.default.object().keys(exports.utilityPaymentPayloadSchema),
};
exports.updateUtilityPaymentPayloadSchema = {
    params: joi_1.default.object().keys({
        utilityId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.utilityPaymentPayloadSchema),
};
exports.updateSingleUtilityPaymentPayloadSchema = {
    params: joi_1.default.object().keys({
        utilityId: joi_1.default.string().custom(validate_1.objectId),
        paymentId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(purchase_validation_1.paymentSchema),
};
exports.deleteUtilityPaymentSchema = {
    params: joi_1.default.object().keys({
        utilityPaymentId: joi_1.default.custom(validate_1.objectId),
    }),
};
//# sourceMappingURL=utilityPayment.validation.js.map