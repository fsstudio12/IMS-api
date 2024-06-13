"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
exports.addressSchema = new mongoose_1.default.Schema({
    location: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
}, {
    _id: false,
});
const customerSchema = new mongoose_1.default.Schema({
    businessId: { type: mongoose_1.default.Schema.Types.ObjectId },
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    image: { type: String },
    type: { type: String, enum: enums_1.CustomerType, default: enums_1.CustomerType.INDIVIDUAL },
    registrationType: { type: String, enum: [...Object.values(enums_1.RegistrationType), null], default: null },
    registrationNumber: { type: String, default: null },
    address: exports.addressSchema,
}, { timestamps: true });
customerSchema.static('isNameTaken', async function isNameTaken(name, businessId, excludeCustomerId) {
    const customer = await this.findOne({
        name,
        businessId,
        _id: {
            $ne: excludeCustomerId,
        },
    });
    return !!customer;
});
customerSchema.static('isPhoneTaken', async function isPhoneTaken(phone, businessId, excludeCustomerId) {
    const customer = await this.findOne({
        phone,
        businessId,
        _id: {
            $ne: excludeCustomerId,
        },
    });
    return !!customer;
});
const Customer = mongoose_1.default.model('Customer', customerSchema);
exports.default = Customer;
//# sourceMappingURL=customer.model.js.map