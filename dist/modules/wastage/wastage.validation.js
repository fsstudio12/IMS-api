"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterWastageSchema = exports.deleteWastageSchema = exports.updateWastageSchema = exports.createWastageSchema = exports.getWastageSchema = void 0;
const http_status_1 = __importDefault(require("http-status"));
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const item_validation_1 = require("../item/item.validation");
const errors_1 = require("../errors");
const createWastageBodySchema = {
    date: joi_1.default.string(),
    description: joi_1.default.string(),
    items: joi_1.default.array().items(joi_1.default.object().keys(item_validation_1.requestCombinationItemSchema)).optional(),
};
const updateWastageBodySchema = {
    date: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    items: joi_1.default.array().items(joi_1.default.object().keys(item_validation_1.requestCombinationItemSchema)).optional(),
};
exports.getWastageSchema = {
    params: joi_1.default.object().keys({
        wastageId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.createWastageSchema = {
    body: joi_1.default.object().keys(createWastageBodySchema),
};
exports.updateWastageSchema = {
    params: joi_1.default.object().keys({
        wastageId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(updateWastageBodySchema),
};
exports.deleteWastageSchema = {
    params: joi_1.default.object().keys({
        wastageId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.filterWastageSchema = {
    query: joi_1.default.object().keys({
        filterType: joi_1.default.string()
            .valid('date', 'item')
            .insensitive()
            .required()
            .error(() => {
            throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'filterType must be one of date or item.');
        }),
    }),
};
//# sourceMappingURL=wastage.validation.js.map