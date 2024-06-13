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
exports.getVendorHistoryHandler = exports.deleteVendorHandler = exports.updateVendorHandler = exports.createVendorHandler = exports.getVendorHandler = exports.getVendorsHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const errors_1 = require("../errors");
const vendorService = __importStar(require("./vendor.service"));
const purchase_service_1 = require("../purchase/purchase.service");
exports.getVendorsHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const vendors = await vendorService.findVendorsByFilterQuery({ businessId });
    res.send((0, SuccessResponse_1.default)({ vendors }));
});
exports.getVendorHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['vendorId'] === 'string') {
        const vendor = await vendorService.findVendorById(new mongoose_1.default.Types.ObjectId(req.params['vendorId']));
        if (!vendor)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Vendor not found.');
        res.send((0, SuccessResponse_1.default)({ vendor }));
    }
});
exports.createVendorHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const vendor = await vendorService.createVendor(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ vendor }));
});
exports.updateVendorHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['vendorId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const vendor = await vendorService.updateVendorById(new mongoose_1.default.Types.ObjectId(req.params['vendorId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ vendor }));
    }
});
exports.deleteVendorHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['vendorId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await vendorService.deleteVendorById(req.params['vendorId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
exports.getVendorHistoryHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['vendorId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const vendorPurchaseHistory = await (0, purchase_service_1.getPurchaseHistoryWithVendor)(new mongoose_1.default.Types.ObjectId(req.params['vendorId']), businessId);
        res.send((0, SuccessResponse_1.default)({ history: vendorPurchaseHistory }));
    }
});
//# sourceMappingURL=vendor.controller.js.map