"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eachUtilityPaymentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sales_model_1 = require("../sales/sales.model");
exports.eachUtilityPaymentSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId },
    title: { type: String },
    payments: [sales_model_1.paymentSchema],
});
const utilityPaymentSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    title: { type: String },
    date: { type: Date },
    from: { type: Date },
    to: { type: Date },
    utilities: [exports.eachUtilityPaymentSchema],
}, { timestamps: true });
const UtilityPayment = mongoose_1.default.model('UtilityPayment', utilityPaymentSchema);
exports.default = UtilityPayment;
//# sourceMappingURL=utilityPayment.model.js.map