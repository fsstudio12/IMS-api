"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipeSchema = exports.updateRecipeSchema = exports.createRecipeSchema = exports.getRecipeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const item_validation_1 = require("../item/item.validation");
exports.getRecipeSchema = {
    params: joi_1.default.object().keys({
        recipeId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
const createRecipeBodySchema = {
    businessId: joi_1.default.optional().custom(validate_1.objectId),
    name: joi_1.default.string().required(),
    quantity: joi_1.default.number().required(),
    quantityMetric: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    combinationItems: joi_1.default.array().items(joi_1.default.object().keys(item_validation_1.requestCombinationItemSchema)).optional(),
};
exports.createRecipeSchema = {
    body: joi_1.default.object().keys(createRecipeBodySchema),
};
exports.updateRecipeSchema = {
    params: joi_1.default.object().keys({
        recipeId: joi_1.default.string().custom(validate_1.objectId),
    }),
    body: joi_1.default.object().keys(createRecipeBodySchema),
};
exports.deleteRecipeSchema = {
    query: joi_1.default.object().keys({
        recipeId: joi_1.default.string(),
    }),
};
//# sourceMappingURL=recipe.validation.js.map