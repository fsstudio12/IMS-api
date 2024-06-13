"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategorySchema = exports.updateCategorySchema = exports.getCategorySchema = exports.getCategoriesSchema = exports.createCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const createCategoryBodySchema = {
    name: joi_1.default.string().required(),
};
exports.createCategorySchema = {
    body: joi_1.default.object().keys(createCategoryBodySchema),
};
exports.getCategoriesSchema = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        projectBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getCategorySchema = {
    params: joi_1.default.object().keys({
        categoryId: joi_1.default.required().custom(validate_1.objectId),
    }),
};
exports.updateCategorySchema = {
    params: joi_1.default.object().keys({
        categoryId: joi_1.default.required().custom(validate_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        name: joi_1.default.string(),
    })
        .min(1),
};
exports.deleteCategorySchema = {
    params: joi_1.default.object().keys({
        categoryId: joi_1.default.required().custom(validate_1.objectId),
    }),
};
//# sourceMappingURL=category.validation.js.map