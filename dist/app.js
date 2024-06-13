"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("./config/config"));
const logger_1 = require("./modules/logger");
const auth_1 = require("./modules/auth");
const utils_1 = require("./modules/utils");
const errors_1 = require("./modules/errors");
const v1_1 = __importDefault(require("./routes/v1"));
const app = (0, express_1.default)();
if (config_1.default.env !== 'test') {
    app.use(logger_1.morgan.successHandler);
    app.use(logger_1.morgan.errorHandler);
}
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// sanitize request data
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, compression_1.default)());
app.use(passport_1.default.initialize());
passport_1.default.use('jwt', auth_1.jwtStrategy);
if (config_1.default.env === 'production') {
    app.use('/v1/auth', utils_1.authLimiter);
}
app.use((req, _res, next) => {
    if (req.body) {
        const payloadSizeBytes = JSON.stringify(req.body).length;
        const payloadSizeMB = payloadSizeBytes / (1024 * 1024);
        console.log('Payload size:', payloadSizeMB.toFixed(2), 'MB');
    }
    next();
});
app.get('/', () => console.log('wadu'));
app.use('/v1', v1_1.default);
app.use((_req, _res, next) => {
    next(new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Not found'));
});
app.use(errors_1.errorConverter);
app.use(errors_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map