"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesPaymentSchema = exports.updateSalesPaymentSchema = exports.addSalesPaymentSchema = exports.deleteSalesSchema = exports.updateSalesSchema = exports.createSalesSchema = exports.updateSalesBodySchema = exports.salesBodySchema = exports.getSalesSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const item_1 = require("../item");
const enums_1 = require("../../config/enums");
const purchase_validation_1 = require("../purchase/purchase.validation");
exports.getSalesSchema = {
    params: joi_1.default.object().keys({
        salesId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
const salesItemSchema = Object.assign(Object.assign({}, item_1.itemValidation.requestCombinationItemSchema), { price: joi_1.default.number().required() });
const paymentInfoSchema = {
    status: joi_1.default.string()
        .valid(...Object.values(enums_1.PaymentStatus))
        .optional(),
    total: joi_1.default.number().optional(),
    paid: joi_1.default.number().optional(),
    remaining: joi_1.default.number().optional(),
    payments: joi_1.default.array().items(joi_1.default.object().keys(purchase_validation_1.paymentSchema)),
};
exports.salesBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    customerId: joi_1.default.custom(validate_1.objectId).required(),
    payment: joi_1.default.object().keys(purchase_validation_1.paymentSchema).optional(),
    date: joi_1.default.string().required(),
    invoiceNumber: joi_1.default.string().required(),
    items: joi_1.default.array().items(joi_1.default.object().keys(salesItemSchema)).min(1),
};
exports.updateSalesBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    customerId: joi_1.default.custom(validate_1.objectId).required(),
    paymentInfo: joi_1.default.object().keys(paymentInfoSchema),
    date: joi_1.default.string().required(),
    invoiceNumber: joi_1.default.string().required(),
    items: joi_1.default.array().items(joi_1.default.object().keys(salesItemSchema)).min(1),
};
exports.createSalesSchema = {
    body: joi_1.default.object().keys(exports.salesBodySchema),
};
exports.updateSalesSchema = {
    params: joi_1.default.object().keys({
        salesId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.updateSalesBodySchema),
};
exports.deleteSalesSchema = {
    params: joi_1.default.object().keys({
        salesId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.addSalesPaymentSchema = {
    params: joi_1.default.object().keys({
        salesId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(purchase_validation_1.paymentSchema),
};
exports.updateSalesPaymentSchema = {
    params: joi_1.default.object().keys({
        salesId: joi_1.default.string().custom(validate_1.objectId),
        paymentId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(purchase_validation_1.paymentSchema),
};
exports.deleteSalesPaymentSchema = {
    params: joi_1.default.object().keys({
        salesId: joi_1.default.string().custom(validate_1.objectId),
        paymentId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
//# sourceMappingURL=sales.validation.js.map