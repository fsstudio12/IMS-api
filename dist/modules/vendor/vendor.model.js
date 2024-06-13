"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
const vendorSchema = new mongoose_1.default.Schema({
    businessId: { type: mongoose_1.default.Schema.Types.ObjectId },
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    registrationType: { type: String, enum: enums_1.RegistrationType, default: enums_1.RegistrationType.PAN },
    registrationNumber: { type: String },
    address: { type: String },
}, { timestamps: true });
vendorSchema.static('isNameTaken', async function isNameTaken(name, businessId, excludeVendorId) {
    const vendor = await this.findOne({
        name,
        businessId,
        _id: {
            $ne: excludeVendorId,
        },
    });
    return !!vendor;
});
const Vendor = mongoose_1.default.model('Vendor', vendorSchema);
exports.default = Vendor;
//# sourceMappingURL=vendor.model.js.map