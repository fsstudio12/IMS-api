"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryById = exports.queryCategories = exports.createCategory = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const category_model_1 = __importDefault(require("./category.model"));
const common_1 = require("../utils/common");
/**
 * Create a category
 * @param {NewCategory} categoryBody
 * @returns {Promise<ICategoryDoc>}
 */
const createCategory = async (categoryBody) => {
    if (await category_model_1.default.isNameTaken(categoryBody.name)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category with the entered name already exists.');
    }
    return category_model_1.default.create(categoryBody);
};
exports.createCategory = createCategory;
const queryCategories = async (filter, options) => {
    const categories = await category_model_1.default.paginate(filter, options);
    return categories;
};
exports.queryCategories = queryCategories;
const getCategoryById = async (id) => category_model_1.default.findById(id);
exports.getCategoryById = getCategoryById;
const updateCategoryById = async (categoryId, employee, updateBody) => {
    const category = await (0, exports.getCategoryById)(categoryId);
    if (!category)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found.');
    if (employee.role !== 'super_admin' && (0, common_1.stringifyObjectId)(employee.business._id) !== (0, common_1.stringifyObjectId)(category.businessId))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You can only update your own categories.');
    Object.assign(category, updateBody);
    await category.save();
    return category;
};
exports.updateCategoryById = updateCategoryById;
const deleteCategoryById = async (categoryId, employee) => {
    const category = await (0, exports.getCategoryById)(categoryId);
    if (!category)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found.');
    if (employee.role !== 'super_admin' && (0, common_1.stringifyObjectId)(employee.business._id) !== (0, common_1.stringifyObjectId)(category.businessId))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You can only update your own categories.');
    await category.deleteOne();
    return category;
};
exports.deleteCategoryById = deleteCategoryById;
const getCategories = async (businessId) => {
    let matchQuery = {};
    if (businessId) {
        matchQuery = {
            businessId,
        };
    }
    const categories = await category_model_1.default.aggregate([
        {
            $match: matchQuery,
        },
        {
            $project: {
                updatedAt: 0,
                __v: 0,
            },
        },
    ]);
    return categories;
};
exports.getCategories = getCategories;
//# sourceMappingURL=category.service.js.map