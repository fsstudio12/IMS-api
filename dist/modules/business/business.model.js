"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const toJSON_1 = require("../toJSON");
const paginate_1 = require("../paginate");
const businessSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    phone: {
        type: String,
    },
}, {
    timestamps: true,
});
businessSchema.static('isEmailTaken', async function (email, excludeBusinessId) {
    const business = await this.findOne({ email, _id: { $ne: excludeBusinessId } });
    return !!business;
});
businessSchema.static('isNameTaken', async function (name, excludeBusinessId) {
    const business = await this.findOne({ name, _id: { $ne: excludeBusinessId } });
    return !!business;
});
businessSchema.plugin(toJSON_1.toJSON);
businessSchema.plugin(paginate_1.paginate);
const Business = mongoose_1.default.model('Business', businessSchema);
exports.default = Business;
//# sourceMappingURL=business.model.js.map