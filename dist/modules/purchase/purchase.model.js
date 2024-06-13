"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseItemSchema = exports.paymentInfoSchema = exports.paymentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
const item_model_1 = require("../item/item.model");
exports.paymentSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    title: { type: String },
    name: { type: String },
    amount: { type: Number },
    method: { type: String, enum: [...Object.values(enums_1.PaymentMethod), null], default: null },
    date: { type: Date },
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
exports.purchaseItemSchema = new mongoose_1.default.Schema(Object.assign(Object.assign({}, item_model_1.combinationItem), { price: Number }));
const purchaseSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    vendorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    paymentInfo: exports.paymentInfoSchema,
    date: { type: Date },
    invoiceNumber: { type: String },
    items: [exports.purchaseItemSchema],
}, {
    timestamps: true,
});
const Purchase = mongoose_1.default.model('Purchase', purchaseSchema);
exports.default = Purchase;
//# sourceMappingURL=purchase.model.js.map