"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokensSchema = exports.logoutSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const registerBodySchema = {
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.string().optional(),
    // password: Joi.string().required().custom(password),
    password: joi_1.default.string().required(),
};
exports.registerSchema = {
    body: joi_1.default.object().keys(registerBodySchema),
};
exports.loginSchema = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.logoutSchema = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.refreshTokensSchema = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.forgotPasswordSchema = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
exports.resetPasswordSchema = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        // password: Joi.string().required().custom(password),
        password: joi_1.default.string().required(),
    }),
};
exports.verifyEmailSchema = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
//# sourceMappingURL=auth.validation.js.map