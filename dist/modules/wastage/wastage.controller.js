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
exports.filterWastagesHandler = exports.deleteWastageHandler = exports.updateWastageHandler = exports.getWastageHandler = exports.getWastagesHandler = exports.createWastageHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const wastageService = __importStar(require("./wastage.service"));
exports.createWastageHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const wastage = await wastageService.createWastage(Object.assign(Object.assign({}, req.body), { businessId }));
    res.send((0, SuccessResponse_1.default)({ wastage }));
});
exports.getWastagesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const wastages = await wastageService.findWastagesByFilterQuery({ businessId });
    res.send((0, SuccessResponse_1.default)({ wastages }));
});
exports.getWastageHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['wastageId'] === 'string') {
        const wastage = await wastageService.findWastageById(new mongoose_1.default.Types.ObjectId(req.params['wastageId']));
        if (!wastage)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Wastage not found.');
        res.send((0, SuccessResponse_1.default)({ wastage }));
    }
});
exports.updateWastageHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['wastageId'] === 'string') {
        const wastage = await wastageService.updateWastageById(new mongoose_1.default.Types.ObjectId(req.params['wastageId']), req.body);
        res.send((0, SuccessResponse_1.default)({ wastage }));
    }
});
exports.deleteWastageHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['wastageId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await wastageService.deleteWastageById(req.params['wastageId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
exports.filterWastagesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    let wastages = [];
    if (req.query['filterType'] === 'date') {
        wastages = await wastageService.getWastagesByDate(businessId);
    }
    else {
        wastages = await wastageService.getWastagesByItem(businessId);
    }
    res.send((0, SuccessResponse_1.default)({ wastages }));
});
//# sourceMappingURL=wastage.controller.js.map