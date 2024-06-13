"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
const item_model_1 = require("../item/item.model");
const recipeSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    name: { type: String, required: true },
    quantity: { type: Number },
    quantityMetric: { type: String, enum: enums_1.QuantityMetric, default: enums_1.QuantityMetric.GRAM },
    price: { type: Number },
    combinationItems: [item_model_1.combinationItemSchema],
}, {
    timestamps: true,
});
recipeSchema.static('isNameTaken', async function isNameTaken(name, businessId, excludeRecipeId) {
    const recipe = await this.findOne({
        name,
        businessId,
        _id: {
            $ne: excludeRecipeId,
        },
    });
    return !!recipe;
});
const Recipe = mongoose_1.default.model('Recipe', recipeSchema);
exports.default = Recipe;
//# sourceMappingURL=recipe.model.js.map