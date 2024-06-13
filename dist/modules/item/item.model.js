"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinationItemSchema = exports.combinationItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
exports.combinationItem = {
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    name: { type: String },
    quantity: { type: Number },
    quantityMetric: { type: String, enum: enums_1.QuantityMetric, default: enums_1.QuantityMetric.GRAM },
};
exports.combinationItemSchema = new mongoose_1.default.Schema(exports.combinationItem);
const itemSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    name: { type: String, required: true },
    quantity: { type: Number },
    quantityMetric: { type: String, enum: enums_1.QuantityMetric, default: enums_1.QuantityMetric.GRAM },
    price: { type: Number, nullable: true },
    isSellable: { type: Boolean, default: true },
    isCombination: { type: Boolean, default: false },
    combinationItems: [exports.combinationItemSchema],
}, {
    timestamps: true,
});
itemSchema.static('isNameTaken', async function isNameTaken(name, businessId, excludeItemId) {
    const item = await this.findOne({
        name,
        businessId,
        _id: {
            $ne: excludeItemId,
        },
    });
    return !!item;
});
const Item = mongoose_1.default.model('Item', itemSchema);
exports.default = Item;
//# sourceMappingURL=item.model.js.map