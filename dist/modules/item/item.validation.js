"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemSchema = exports.updateItemSchema = exports.createItemSchema = exports.requestCombinationItemSchema = exports.getItemSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
exports.getItemSchema = {
    params: joi_1.default.object().keys({
        itemId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.requestCombinationItemSchema = {
    _id: joi_1.default.custom(validate_1.objectId).required(),
    quantity: joi_1.default.number().required(),
    quantityMetric: joi_1.default.string().required(),
};
const createItemBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    name: joi_1.default.string().required(),
    quantity: joi_1.default.number().required(),
    quantityMetric: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    isSellable: joi_1.default.boolean().required(),
    isCombination: joi_1.default.boolean().required(),
    combinationItems: joi_1.default.array().items(joi_1.default.object().keys(exports.requestCombinationItemSchema)).optional(),
};
const updateItemBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    name: joi_1.default.string().optional(),
    quantity: joi_1.default.number().optional(),
    quantityMetric: joi_1.default.string().optional(),
    price: joi_1.default.number().optional().allow(null),
    isSellable: joi_1.default.boolean().optional(),
    isCombination: joi_1.default.boolean().optional(),
    combinationItems: joi_1.default.array().items(joi_1.default.object().keys(exports.requestCombinationItemSchema)).optional(),
};
exports.createItemSchema = {
    body: joi_1.default.object().keys(createItemBodySchema),
};
exports.updateItemSchema = {
    params: joi_1.default.object().keys({
        itemId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(updateItemBodySchema),
};
exports.deleteItemSchema = {
    query: joi_1.default.object().keys({
        itemId: joi_1.default.string(),
    }),
};
//# sourceMappingURL=item.validation.js.map