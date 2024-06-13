"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUtilityPaymentsHandler = exports.updateUtilityPaymentHandler = exports.createUtilityPaymentHandler = exports.getUtilityPaymentHandler = exports.getUtilityPaymentsHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const utilityPayment_service_1 = require("./utilityPayment.service");
exports.getUtilityPaymentsHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const utilityPayments = await (0, utilityPayment_service_1.getUtilityPaymentsByFilterQuery)({ businessId });
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ utilityPayments }));
});
exports.getUtilityPaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['utilityPaymentId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const utilityPayment = await (0, utilityPayment_service_1.findUtilityPaymentByIdAndBusinessId)(new mongoose_1.default.Types.ObjectId(req.params['utilityPaymentId']), businessId);
        res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ utilityPayment }));
    }
});
exports.createUtilityPaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const utilityPayment = await (0, utilityPayment_service_1.createUtilityPayment)(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ utilityPayment }));
});
exports.updateUtilityPaymentHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['utilityId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const utilityPayment = await (0, utilityPayment_service_1.updateUtilityPaymentById)(new mongoose_1.default.Types.ObjectId(req.params['utilityPaymentId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ utilityPayment }));
    }
});
exports.deleteUtilityPaymentsHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.query['utilityPaymentId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await (0, utilityPayment_service_1.deleteUtilityPaymentsById)(req.query['utilityPaymentId'], businessId);
        res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)());
    }
});
//# sourceMappingURL=utilityPayment.controller.js.map