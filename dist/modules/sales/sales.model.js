"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesItemSchema = exports.paymentInfoSchema = exports.paymentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
const item_model_1 = require("../item/item.model");
exports.paymentSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    name: { type: String },
    amount: { type: Number },
    method: { type: String, enum: [...Object.values(enums_1.PaymentMethod), null], default: null },
    date: { type: Date, default: new Date() },
});
exports.paymentInfoSchema = new mongoose_1.default.Schema({
    status: { type: String, enum: enums_1.PaymentStatus, default: enums_1.PaymentStatus.NOT_PAID },
    string: { type: String },
    total: { type: Number },
    paid: { type: Number },
    remaining: { type: Number },
    returned: { type: Number },
    payments: [exports.paymentSchema],
}, { _id: false });
exports.salesItemSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, item_model_1.combinationItem), { price: Number }));
const salesSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    customerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    paymentInfo: exports.paymentInfoSchema,
    date: { type: Date, nullable: true },
    invoiceNumber: { type: String },
    items: [exports.salesItemSchema],
}, {
    timestamps: true,
});
const Sales = mongoose_1.default.model('Sales', salesSchema);
exports.default = Sales;
//# sourceMappingURL=sales.model.js.map