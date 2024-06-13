"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBusinessAdminHandler = exports.deleteDepartmentHandler = exports.updateDepartmentHandler = exports.createDepartmentHandler = exports.getDepartmentHandler = exports.getDepartmentsHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const department_service_1 = require("./department.service");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const errors_1 = require("../errors");
exports.getDepartmentsHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const departments = await (0, department_service_1.getDepartmentsByBusinessId)(businessId);
    res.send((0, SuccessResponse_1.default)({ departments }));
});
exports.getDepartmentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['departmentId'] === 'string') {
        const department = await (0, department_service_1.findDepartmentById)(new mongoose_1.default.Types.ObjectId(req.params['departmentId']));
        if (!department)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Department not found.');
        res.send((0, SuccessResponse_1.default)({ department }));
    }
});
exports.createDepartmentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const department = await (0, department_service_1.createDepartment)(Object.assign(Object.assign({}, req.body), { businessId }), null);
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ department }));
});
exports.updateDepartmentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['departmentId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const department = await (0, department_service_1.updateDepartmentById)(new mongoose_1.default.Types.ObjectId(req.params['departmentId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ department }));
    }
});
exports.deleteDepartmentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.query['departmentId'] === 'string') {
        await (0, department_service_1.deleteDepartmentsById)(req.query['departmentId']);
        res.send((0, SuccessResponse_1.default)());
    }
});
exports.createBusinessAdminHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const { businessId } = req.body;
    const adminDepartment = await (0, department_service_1.createAdminDepartmentForBusiness)(new mongoose_1.default.Types.ObjectId(businessId), null);
    res.send((0, SuccessResponse_1.default)({ adminDepartment }));
});
//# sourceMappingURL=department.controller.js.map