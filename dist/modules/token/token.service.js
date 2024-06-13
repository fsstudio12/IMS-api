"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerifyEmailToken = exports.generateResetPasswordToken = exports.generateAccessToken = exports.generateAuthTokens = exports.verifyToken = exports.saveToken = exports.generateToken = exports.findToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
const token_model_1 = __importDefault(require("./token.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const token_types_1 = __importDefault(require("./token.types"));
const employee_1 = require("../employee");
/**
 * Generate token
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
const findToken = async (employeeId, type) => token_model_1.default.findOne({ employee: employeeId, type });
exports.findToken = findToken;
/**
 * Generate token
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (employeeId, expires, type, secret = config_1.default.jwt.secret) => {
    const payload = {
        sub: employeeId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
const saveToken = async (token, employeeId, expires, type, blacklisted = false, session = null) => {
    const options = session ? { session } : undefined;
    const [tokenDoc] = await token_model_1.default.create([
        {
            token,
            employee: employeeId,
            expires: expires.toDate(),
            type,
            blacklisted,
        },
    ], options);
    if (!tokenDoc)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong.');
    return tokenDoc;
};
exports.saveToken = saveToken;
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
const verifyToken = async (token, type) => {
    const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    if (typeof payload.sub !== 'string') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'bad employee');
    }
    const tokenDoc = await token_model_1.default.findOne({
        token,
        type,
        employee: payload.sub,
        blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};
exports.verifyToken = verifyToken;
/**
 * Generate auth tokens
 * @param {IEmployeeDoc} employee
 * @returns {Promise<AccessAndRefreshTokens>}
 */
const generateAuthTokens = async (employee) => {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = (0, exports.generateToken)(employee.id, accessTokenExpires, token_types_1.default.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
    const refreshToken = (0, exports.generateToken)(employee.id, refreshTokenExpires, token_types_1.default.REFRESH);
    const dbRefreshToken = await (0, exports.findToken)(employee.id, token_types_1.default.REFRESH);
    if (dbRefreshToken)
        await dbRefreshToken.deleteOne();
    await (0, exports.saveToken)(refreshToken, employee.id, refreshTokenExpires, token_types_1.default.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
exports.generateAuthTokens = generateAuthTokens;
const generateAccessToken = async (employee) => {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = (0, exports.generateToken)(employee.id, accessTokenExpires, token_types_1.default.ACCESS);
    const refreshToken = await (0, exports.findToken)(employee.id, token_types_1.default.REFRESH);
    if (!refreshToken)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Refresh token does not exist.');
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken.token,
            expires: refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.expires,
        },
    };
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email, session = null) => {
    const employee = await employee_1.employeeService.findEmployeeByEmail(email);
    if (!employee) {
        throw new ApiError_1.default(http_status_1.default.NO_CONTENT, '');
    }
    const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = (0, exports.generateToken)(employee.id, expires, token_types_1.default.RESET_PASSWORD);
    await (0, exports.saveToken)(resetPasswordToken, employee.id, expires, token_types_1.default.RESET_PASSWORD, false, session);
    return resetPasswordToken;
};
exports.generateResetPasswordToken = generateResetPasswordToken;
/**
 * Generate verify email token
 * @param {IEmployeeForAuth} employee
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (employee, session = null) => {
    const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = (0, exports.generateToken)(employee._id, expires, token_types_1.default.VERIFY_EMAIL);
    await (0, exports.saveToken)(verifyEmailToken, employee._id, expires, token_types_1.default.VERIFY_EMAIL, false, session);
    return verifyEmailToken;
};
exports.generateVerifyEmailToken = generateVerifyEmailToken;
//# sourceMappingURL=token.service.js.map