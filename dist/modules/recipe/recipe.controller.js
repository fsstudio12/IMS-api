"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeTableListHandler = exports.deleteRecipeHandler = exports.updateRecipeHandler = exports.getRecipeHandler = exports.getRecipesHandler = exports.createRecipeHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const recipeService = __importStar(require("./recipe.service"));
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
exports.createRecipeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const recipe = await recipeService.createRecipe(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ recipe }));
});
exports.getRecipesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const recipes = await recipeService.getRecipesByBusinessId(businessId);
    res.send((0, SuccessResponse_1.default)({ recipes }));
});
exports.getRecipeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['recipeId'] === 'string') {
        const recipe = await recipeService.findRecipeById(new mongoose_1.default.Types.ObjectId(req.params['recipeId']));
        if (!recipe)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Recipe not found.');
        res.send((0, SuccessResponse_1.default)({ recipe }));
    }
});
exports.updateRecipeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['recipeId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const recipe = await recipeService.updateRecipeById(new mongoose_1.default.Types.ObjectId(req.params['recipeId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ recipe }));
    }
});
exports.deleteRecipeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.query['recipeId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await recipeService.deleteRecipesById(req.query['recipeId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
exports.recipeTableListHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const tableListRecipes = await recipeService.getRecipeTableListHandler(businessId);
    res.send((0, SuccessResponse_1.default)({ recipes: tableListRecipes }));
});
//# sourceMappingURL=recipe.controller.js.map