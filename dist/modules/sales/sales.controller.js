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
exports.deleteSalesHandler = exports.removeSalesPaymentHandler = exports.updateSalesPaymentHandler = exports.addSalesPaymentHandler = exports.updateSalesHandler = exports.getSingleSalesHandler = exports.getSalesHandler = exports.createSalesHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const salesService = __importStar(require("./sales.service"));
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const errors_1 = require("../errors");
exports.createSalesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const sales = await salesService.createSales(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ sales }));
});
exports.getSalesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const sales = await salesService.getSalesByBusinessId(businessId);
    res.send((0, SuccessResponse_1.default)({ sales }));
});
exports.getSingleSalesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['salesId'] === 'string') {
        const sales = await salesService.findSalesById(new mongoose_1.default.Types.ObjectId(req.params['salesId']));
        if (!sales)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Sales not found.');
        res.send((0, SuccessResponse_1.default)({ sales }));
    }
});
exports.updateSalesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['salesId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const sales = await salesService.updateSalesById(new mongoose_1.default.Types.ObjectId(req.params['salesId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.send((0, SuccessResponse_1.default)({ sales }));
    }
});
exports.addSalesPaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['salesId'] === 'string') {
        const sales = await salesService.addSalesPayment(new mongoose_1.default.Types.ObjectId(req.params['salesId']), req.body);
        res.send((0, SuccessResponse_1.default)({ sales }));
    }
});
exports.updateSalesPaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['salesId'] === 'string' && typeof req.params['paymentId'] === 'string') {
        const sales = await salesService.updateSalesPayment(new mongoose_1.default.Types.ObjectId(req.params['salesId']), new mongoose_1.default.Types.ObjectId(req.params['paymentId']), req.body);
        res.send((0, SuccessResponse_1.default)({ sales }));
    }
});
exports.removeSalesPaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['salesId'] === 'string' && typeof req.params['paymentId'] === 'string') {
        const sales = await salesService.removeSalesPayment(new mongoose_1.default.Types.ObjectId(req.params['salesId']), new mongoose_1.default.Types.ObjectId(req.params['paymentId']));
        res.send((0, SuccessResponse_1.default)({ sales }));
    }
});
exports.deleteSalesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['salesId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await salesService.deleteSales(req.params['salesId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
//# sourceMappingURL=sales.controller.js.map