"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBanUser = exports.toggleVerifyUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const employee_service_1 = require("../employee/employee.service");
const errors_1 = require("../errors");
const toggleVerifyUser = async (userId) => {
    const user = await (0, employee_service_1.findEmployeeById)(userId);
    if (!user)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'User not found.');
    user.isVerified = !user.isVerified;
    await user.save();
};
exports.toggleVerifyUser = toggleVerifyUser;
const toggleBanUser = async (userId) => {
    const user = await (0, employee_service_1.findEmployeeById)(userId);
    if (!user)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'User not found.');
    user.isBanned = !user.isBanned;
    await user.save();
};
exports.toggleBanUser = toggleBanUser;
//# sourceMappingURL=admin.service.js.map