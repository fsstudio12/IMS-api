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
exports.deleteEmployeeHandler = exports.updateEmployeeHandler = exports.getEmployeeHandler = exports.getEmployeesHandler = exports.createEmployeeHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// import { IOptions } from '../paginate/paginate';
const employeeService = __importStar(require("./employee.service"));
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const enums_1 = require("../../config/enums");
exports.createEmployeeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const employee = await employeeService.createEmployee(Object.assign(Object.assign({}, req.body), { role: enums_1.Role.EMPLOYEE, businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ employee }));
});
exports.getEmployeesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    // const filter = pick(req.query, ['name', 'role']);
    // const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    // const result = await employeeService.queryEmployees(filter, options);
    // res.send(createSuccessResponse(result));
    res.send((0, SuccessResponse_1.default)({ employees: await employeeService.getEmployeesByRole(req.employee) }));
});
exports.getEmployeeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['employeeId'] === 'string') {
        const employee = await employeeService.findEmployeeById(new mongoose_1.default.Types.ObjectId(req.params['employeeId']));
        if (!employee)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Employee not found');
        res.send((0, SuccessResponse_1.default)({ employee }));
    }
});
exports.updateEmployeeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['employeeId'] === 'string') {
        const employee = await employeeService.updateEmployeeById(new mongoose_1.default.Types.ObjectId(req.params['employeeId']), req.body);
        res.send((0, SuccessResponse_1.default)({ employee }));
    }
});
exports.deleteEmployeeHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['employeeId'] === 'string') {
        await employeeService.deleteEmployeeById(new mongoose_1.default.Types.ObjectId(req.params['employeeId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
});
//# sourceMappingURL=employee.controller.js.map