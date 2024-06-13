"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchasePaymentSchema = exports.updatePurchasePaymentSchema = exports.addPurchasePaymentSchema = exports.deletePurchaseSchema = exports.updatePurchaseSchema = exports.createPurchaseSchema = exports.updatePurchaseBodySchema = exports.purchaseBodySchema = exports.paymentSchema = exports.getPurchaseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const item_1 = require("../item");
const enums_1 = require("../../config/enums");
exports.getPurchaseSchema = {
    params: joi_1.default.object().keys({
        purchaseId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.paymentSchema = {
    _id: joi_1.default.custom(validate_1.objectId).optional().allow(null, ''),
    title: joi_1.default.string().optional(),
    name: joi_1.default.string().optional(),
    amount: joi_1.default.number(),
    method: joi_1.default.string().optional().allow(null),
    date: joi_1.default.string().optional,
};
const purchaseItemSchema = Object.assign(Object.assign({}, item_1.itemValidation.requestCombinationItemSchema), { price: joi_1.default.number().required() });
const paymentInfoSchema = {
    status: joi_1.default.string()
        .valid(...Object.values(enums_1.PaymentStatus))
        .optional(),
    total: joi_1.default.number().optional(),
    paid: joi_1.default.number().optional(),
    remaining: joi_1.default.number().optional(),
    payments: joi_1.default.array().items(joi_1.default.object().keys(exports.paymentSchema)),
};
exports.purchaseBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    vendorId: joi_1.default.custom(validate_1.objectId).required(),
    payment: joi_1.default.object().keys(exports.paymentSchema).optional(),
    date: joi_1.default.string().optional(),
    invoiceNumber: joi_1.default.string().optional(),
    items: joi_1.default.array().items(joi_1.default.object().keys(purchaseItemSchema)).min(1),
};
exports.updatePurchaseBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    vendorId: joi_1.default.custom(validate_1.objectId).required(),
    paymentInfo: joi_1.default.object().keys(paymentInfoSchema),
    date: joi_1.default.string().optional(),
    invoiceNumber: joi_1.default.string().optional(),
    items: joi_1.default.array().items(joi_1.default.object().keys(purchaseItemSchema)).min(1),
};
exports.createPurchaseSchema = {
    body: joi_1.default.object().keys(exports.purchaseBodySchema),
};
exports.updatePurchaseSchema = {
    params: joi_1.default.object().keys({
        purchaseId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.updatePurchaseBodySchema),
};
exports.deletePurchaseSchema = {
    params: joi_1.default.object().keys({
        purchaseId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.addPurchasePaymentSchema = {
    params: joi_1.default.object().keys({
        purchaseId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.paymentSchema),
};
exports.updatePurchasePaymentSchema = {
    params: joi_1.default.object().keys({
        purchaseId: joi_1.default.string().custom(validate_1.objectId),
        paymentId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(exports.paymentSchema),
};
exports.deletePurchasePaymentSchema = {
    params: joi_1.default.object().keys({
        purchaseId: joi_1.default.string().custom(validate_1.objectId),
        paymentId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
//# sourceMappingURL=purchase.validation.js.map