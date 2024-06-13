"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailHandler = exports.sendVerificationEmailHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.refreshTokensHandler = exports.logoutHandler = exports.loginHandler = exports.registerHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const config_1 = __importDefault(require("../../config/config"));
const token_1 = require("../token");
const employee_1 = require("../employee");
const authService = __importStar(require("./auth.service"));
const email_1 = require("../email");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const business_1 = require("../business");
const transactionWrapper_1 = __importDefault(require("../utils/transactionWrapper"));
const errors_1 = require("../errors");
const department_1 = require("../department");
exports.registerHandler = (0, catchAsync_1.default)(async (req, res) => {
    await (0, transactionWrapper_1.default)(async (session) => {
        const business = await business_1.businessService.createBusiness(req.body, session);
        const adminDepartment = await department_1.departmentService.createAdminDepartmentForBusiness(business._id, session);
        const employee = await employee_1.employeeService.registerEmployee(Object.assign(Object.assign({}, req.body), { businessId: business._id, departmentId: adminDepartment._id }), session);
        res.status(http_status_1.default.CREATED).send({ employee });
    });
});
exports.loginHandler = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const employee = await authService.loginEmployeeWithEmailAndPassword(email, password);
    const tokens = await token_1.tokenService.generateAuthTokens(employee);
    res.send((0, SuccessResponse_1.default)({ employee, tokens }, 'Successfully logged in.'));
});
exports.logoutHandler = (0, catchAsync_1.default)(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.refreshTokensHandler = (0, catchAsync_1.default)(async (req, res) => {
    const employeeWithTokens = await authService.refreshAuth(req.body.refreshToken);
    res.send((0, SuccessResponse_1.default)(Object.assign({}, employeeWithTokens)));
});
exports.forgotPasswordHandler = (0, catchAsync_1.default)(async (req, res) => {
    await (0, transactionWrapper_1.default)(async (session) => {
        const [resetPasswordToken] = await token_1.tokenService.generateResetPasswordToken(req.body.email, session);
        if (!resetPasswordToken)
            throw new errors_1.ApiError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong.');
        await email_1.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
        res
            .status(config_1.default.env === 'development' ? http_status_1.default.OK : http_status_1.default.NO_CONTENT)
            .send((0, SuccessResponse_1.default)(config_1.default.env === 'development' && { resetPasswordToken }));
    });
});
exports.resetPasswordHandler = (0, catchAsync_1.default)(async (req, res) => {
    await authService.resetPassword(req.query['token'], req.body.password);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.sendVerificationEmailHandler = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.employee.isEmailVerified) {
        await (0, transactionWrapper_1.default)(async (session) => {
            const verifyEmailToken = await token_1.tokenService.generateVerifyEmailToken(req.employee, session);
            await email_1.emailService.sendVerificationEmail(req.employee.email, verifyEmailToken, req.employee.name);
            res
                .status(config_1.default.env === 'development' ? http_status_1.default.OK : http_status_1.default.NO_CONTENT)
                .send((0, SuccessResponse_1.default)(config_1.default.env === 'development' && { verifyEmailToken }));
        });
    }
    else {
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)(null, 'Your email is already verified.'));
    }
});
exports.verifyEmailHandler = (0, catchAsync_1.default)(async (req, res) => {
    await authService.verifyEmail(req.query['token']);
    res.status(http_status_1.default.NO_CONTENT).send();
});
//# sourceMappingURL=auth.controller.js.map