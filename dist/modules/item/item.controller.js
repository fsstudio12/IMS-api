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
exports.itemTableListHandler = exports.deleteItemHandler = exports.updateItemHandler = exports.getItemHandler = exports.getItemsHandler = exports.createItemHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const itemService = __importStar(require("./item.service"));
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
exports.createItemHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const item = await itemService.createItem(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ item }));
});
exports.getItemsHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const items = await itemService.getItemTableListHandler(businessId);
    res.send((0, SuccessResponse_1.default)({ items }));
});
exports.getItemHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['itemId'] === 'string') {
        const item = await itemService.findItemById(new mongoose_1.default.Types.ObjectId(req.params['itemId']));
        if (!item)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Item not found.');
        res.send((0, SuccessResponse_1.default)({ item }));
    }
});
exports.updateItemHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['itemId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const item = await itemService.updateItemById(new mongoose_1.default.Types.ObjectId(req.params['itemId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ item }));
    }
});
exports.deleteItemHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.query['id'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await itemService.deleteItemsById(req.query['id'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
exports.itemTableListHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const tableListItems = await itemService.getItemTableListHandler(businessId);
    res.send((0, SuccessResponse_1.default)({ items: tableListItems }));
});
//# sourceMappingURL=item.controller.js.map