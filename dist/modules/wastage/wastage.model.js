"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wastageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const purchase_model_1 = require("../purchase/purchase.model");
exports.wastageSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    // employeeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Employee',
    // },
    date: { type: Date },
    description: { type: String },
    items: [purchase_model_1.purchaseItemSchema],
}, { timestamps: true });
const Wastage = mongoose_1.default.model('Wastage', exports.wastageSchema);
exports.default = Wastage;
//# sourceMappingURL=wastage.model.js.map