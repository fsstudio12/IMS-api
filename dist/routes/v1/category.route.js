"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const category_1 = require("../../modules/category");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(category_1.categoryValidation.getCategoriesSchema), category_1.categoryController.getCategoriesHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(category_1.categoryValidation.createCategorySchema), category_1.categoryController.createCategoryHandler);
router
    .route('/:categoryId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(category_1.categoryValidation.getCategorySchema), category_1.categoryController.getCategoryHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(category_1.categoryValidation.updateCategorySchema), category_1.categoryController.updateCategoryHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(category_1.categoryValidation.deleteCategorySchema), category_1.categoryController.deleteCategoryHandler);
exports.default = router;
//# sourceMappingURL=category.route.js.map