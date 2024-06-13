"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginEmployeeWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const token_model_1 = __importDefault(require("../token/token.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const token_types_1 = __importDefault(require("../token/token.types"));
const employee_service_1 = require("../employee/employee.service");
const token_service_1 = require("../token/token.service");
/**
 * Login with employee name and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IEmployeeDoc>}
 */
const loginEmployeeWithEmailAndPassword = async (email, password) => {
    const employee = await (0, employee_service_1.findEmployeeByEmail)(email);
    if (!employee)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Employee not found.');
    if (employee.role !== 'super_admin' && (employee === null || employee === void 0 ? void 0 : employee.isBanned))
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Your account is banned. Please contact NIMS for next steps.');
    if (!(await employee.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    return employee;
};
exports.loginEmployeeWithEmailAndPassword = loginEmployeeWithEmailAndPassword;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken) => {
    const refreshTokenDoc = await token_model_1.default.findOne({ token: refreshToken, type: token_types_1.default.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
};
exports.logout = logout;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IEmployeeWithTokens>}
 */
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await (0, token_service_1.verifyToken)(refreshToken, token_types_1.default.REFRESH);
        const employee = await (0, employee_service_1.findEmployeeById)(new mongoose_1.default.Types.ObjectId(refreshTokenDoc.employee));
        if (!employee) {
            throw new Error();
        }
        // await refreshTokenDoc.deleteOne();
        const tokens = await (0, token_service_1.generateAccessToken)(employee);
        return { employee, tokens };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
};
exports.refreshAuth = refreshAuth;
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await (0, token_service_1.verifyToken)(resetPasswordToken, token_types_1.default.RESET_PASSWORD);
        const employee = await (0, employee_service_1.findEmployeeById)(new mongoose_1.default.Types.ObjectId(resetPasswordTokenDoc.employee));
        if (!employee) {
            throw new Error();
        }
        await (0, employee_service_1.updateEmployeeById)(employee.id, { password: newPassword });
        await token_model_1.default.deleteMany({ employee: employee.id, type: token_types_1.default.RESET_PASSWORD });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
};
exports.resetPassword = resetPassword;
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IEmployeeDoc | null>}
 */
const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await (0, token_service_1.verifyToken)(verifyEmailToken, token_types_1.default.VERIFY_EMAIL);
        const employee = await (0, employee_service_1.findEmployeeById)(new mongoose_1.default.Types.ObjectId(verifyEmailTokenDoc.employee));
        if (!employee) {
            throw new Error();
        }
        await token_model_1.default.deleteMany({ employee: employee.id, type: token_types_1.default.VERIFY_EMAIL });
        const updatedEmployee = await (0, employee_service_1.updateEmployeeById)(employee.id, { isEmailVerified: true });
        return updatedEmployee;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
    }
};
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=auth.service.js.map