"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const resources_1 = __importDefault(require("../../config/resources"));
const actions_1 = __importDefault(require("../../config/actions"));
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, employee, info) => {
    if (err || info || !employee) {
        return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
    }
    req.employee = employee;
    if (employee.role !== 'super_admin' && Object.keys(requiredRights).length > 0) {
        const employeePermissions = employee.department.permissions;
        if (!employeePermissions)
            return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have the permissions to access this resource.'));
        for (const resource in requiredRights) {
            if (Object.prototype.hasOwnProperty.call(requiredRights, resource)) {
                const actions = requiredRights[resource];
                const resourcePermissions = employeePermissions[resource] || [];
                const hasRequiredRights = resourcePermissions.includes(actions_1.default.ALL) ||
                    actions.every((action) => resourcePermissions.includes(action));
                if (!hasRequiredRights) {
                    return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have the permissions to access this resource.'));
                }
            }
        }
    }
    resolve();
};
const getDefaultRights = () => {
    const defaultRights = {};
    for (const resource in resources_1.default) {
        if (Object.prototype.hasOwnProperty.call(resources_1.default, resource)) {
            defaultRights[resource] = [];
        }
    }
    return defaultRights;
};
const authMiddleware = (requiredRights = getDefaultRights()) => async (req, res, next) => new Promise((resolve, reject) => {
    passport_1.default.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
})
    .then(() => next())
    .catch((err) => next(err));
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map