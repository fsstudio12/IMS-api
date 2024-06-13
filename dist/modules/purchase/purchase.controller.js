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
exports.deletePurchaseHandler = exports.removePurchasePaymentHandler = exports.updatePurchasePaymentHandler = exports.addPurchasePaymentHandler = exports.updatePurchaseHandler = exports.getPurchaseHandler = exports.getPurchasesHandler = exports.createPurchaseHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const purchaseService = __importStar(require("./purchase.service"));
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const errors_1 = require("../errors");
exports.createPurchaseHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const purchase = await purchaseService.createPurchase(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)(purchase));
});
exports.getPurchasesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const purchases = await purchaseService.getPurchasesByBusinessId(businessId);
    res.send((0, SuccessResponse_1.default)({ purchases }));
});
exports.getPurchaseHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['purchaseId'] === 'string') {
        const purchase = await purchaseService.findPurchaseById(new mongoose_1.default.Types.ObjectId(req.params['purchaseId']));
        if (!purchase)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Purchase not found.');
        res.send((0, SuccessResponse_1.default)(purchase));
    }
});
exports.updatePurchaseHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['purchaseId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const purchase = await purchaseService.updatePurchaseById(new mongoose_1.default.Types.ObjectId(req.params['purchaseId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.send((0, SuccessResponse_1.default)(purchase));
    }
});
exports.addPurchasePaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['purchaseId'] === 'string') {
        const purchase = await purchaseService.addPurchasePayment(new mongoose_1.default.Types.ObjectId(req.params['purchaseId']), req.body);
        res.send((0, SuccessResponse_1.default)(purchase));
    }
});
exports.updatePurchasePaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['purchaseId'] === 'string' && typeof req.params['paymentId'] === 'string') {
        const purchase = await purchaseService.updatePurchasePayment(new mongoose_1.default.Types.ObjectId(req.params['purchaseId']), new mongoose_1.default.Types.ObjectId(req.params['paymentId']), req.body);
        res.send((0, SuccessResponse_1.default)(purchase));
    }
});
exports.removePurchasePaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['purchaseId'] === 'string' && typeof req.params['paymentId'] === 'string') {
        const purchase = await purchaseService.removePurchasePayment(new mongoose_1.default.Types.ObjectId(req.params['purchaseId']), new mongoose_1.default.Types.ObjectId(req.params['paymentId']));
        res.send((0, SuccessResponse_1.default)(purchase));
    }
});
exports.deletePurchaseHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['purchaseId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await purchaseService.deletePurchase(req.params['purchaseId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
//# sourceMappingURL=purchase.controller.js.map