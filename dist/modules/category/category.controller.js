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
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.getCategoryHandler = exports.getCategoriesHandler = exports.createCategoryHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importStar(require("http-status"));
const utils_1 = require("../utils");
const categoryService = __importStar(require("./category.service"));
const errors_1 = require("../errors");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
exports.createCategoryHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const category = await categoryService.createCategory(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ category }));
});
exports.getCategoriesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const categories = await categoryService.getCategories(businessId);
    res.send((0, SuccessResponse_1.default)({ categories }));
});
exports.getCategoryHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['categoryId'] === 'string') {
        const category = await categoryService.getCategoryById(new mongoose_1.default.Types.ObjectId(req.params['categoryId']));
        if (!category)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Category not found.');
        res.send((0, SuccessResponse_1.default)({ category }));
    }
});
exports.updateCategoryHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['categoryId'] === 'string') {
        const category = await categoryService.updateCategoryById(new mongoose_1.default.Types.ObjectId(req.params['categoryId']), req.employee, req.body);
        res.send((0, SuccessResponse_1.default)({ category }));
    }
});
exports.deleteCategoryHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['categoryId'] === 'string') {
        await categoryService.deleteCategoryById(new mongoose_1.default.Types.ObjectId(req.params['categoryId']), req.employee);
        res.status(http_status_1.NO_CONTENT).send();
    }
});
//# sourceMappingURL=category.controller.js.map