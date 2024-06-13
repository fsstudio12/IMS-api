"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resources_1 = __importDefault(require("../../config/resources"));
const actions_1 = __importDefault(require("../../config/actions"));
const permissionsSchema = {};
Object.values(resources_1.default).forEach((resource) => {
    permissionsSchema[resource] = { type: [String], enum: actions_1.default };
});
const departmentSchema = new mongoose_1.default.Schema({
    businessId: { type: mongoose_1.default.Schema.Types.ObjectId },
    title: { type: String, required: true },
    permissions: permissionsSchema,
}, {
    timestamps: true,
});
/**
 * Check if department title is taken
 * @param {string} title - The department's title
 * @param {ObjectId} [excludeDepartmentId] - The id of the department to be excluded
 * @returns {Promise<boolean>}
 */
departmentSchema.static('isTitleTaken', async function isTitleTaken(title, businessId, excludeDepartmentId) {
    const department = await this.findOne({
        title,
        businessId,
        _id: {
            $ne: excludeDepartmentId,
        },
    });
    return !!department;
});
const Department = mongoose_1.default.model('Department', departmentSchema);
exports.default = Department;
//# sourceMappingURL=department.model.js.map