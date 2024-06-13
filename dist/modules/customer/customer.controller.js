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
exports.deleteCustomerHandler = exports.updateCustomerHandler = exports.createCustomerHandler = exports.getCustomerHandler = exports.getCustomersHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const errors_1 = require("../errors");
const customerService = __importStar(require("./customer.service"));
exports.getCustomersHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const customers = await customerService.findCustomersByFilterQuery({ businessId });
    res.send((0, SuccessResponse_1.default)({ customers }));
});
exports.getCustomerHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['customerId'] === 'string') {
        const customer = await customerService.findCustomerById(new mongoose_1.default.Types.ObjectId(req.params['customerId']));
        if (!customer)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Customer not found.');
        res.send((0, SuccessResponse_1.default)({ customer }));
    }
});
exports.createCustomerHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const customer = await customerService.createCustomer(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ customer }));
});
exports.updateCustomerHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['customerId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const customer = await customerService.updateCustomerById(new mongoose_1.default.Types.ObjectId(req.params['customerId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ customer }));
    }
});
exports.deleteCustomerHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['customerId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await customerService.deleteCustomersById(req.params['customerId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
//# sourceMappingURL=customer.controller.js.map