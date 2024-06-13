"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utilitySchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
    },
    title: { type: String },
}, { timestamps: true });
const Utility = mongoose_1.default.model('Utility', utilitySchema);
exports.default = Utility;
//# sourceMappingURL=utility.model.js.map