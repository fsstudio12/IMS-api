"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passport_jwt_1 = require("passport-jwt");
const token_types_1 = __importDefault(require("../token/token.types"));
const config_1 = __importDefault(require("../../config/config"));
const employee_service_1 = require("../employee/employee.service");
const jwtStrategy = new passport_jwt_1.Strategy({
    secretOrKey: config_1.default.jwt.secret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (payload, done) => {
    try {
        if (payload.type !== token_types_1.default.ACCESS) {
            throw new Error('Invalid token type');
        }
        const [employee] = await (0, employee_service_1.getEmployeesByFilterQuery)({
            _id: new mongoose_1.default.Types.ObjectId(payload.sub),
        });
        if (!employee) {
            return done(null, false);
        }
        done(null, employee);
    }
    catch (error) {
        done(error, false);
    }
});
exports.default = jwtStrategy;
//# sourceMappingURL=passport.js.map