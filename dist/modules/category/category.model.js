"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_1 = require("../toJSON");
const categorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    businessId: { type: mongoose_1.default.Schema.Types.ObjectId },
}, {
    timestamps: true,
});
/**
 * Check if category name is taken
 * @param {string} name - The category's name
 * @param {ObjectId} [excludeUserId] - The id of the category to be excluded
 * @returns {Promise<boolean>}
 */
categorySchema.static('isNameTaken', async function (name, excludeCategoryId) {
    const category = await this.findOne({ name, _id: { $ne: excludeCategoryId } });
    return !!category;
});
categorySchema.plugin(toJSON_1.toJSON);
const Category = mongoose_1.default.model('Category', categorySchema);
exports.default = Category;
//# sourceMappingURL=category.model.js.map