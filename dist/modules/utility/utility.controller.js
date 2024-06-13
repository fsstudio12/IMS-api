"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUtilityHandler = exports.updateUtilityHandler = exports.createUtilityHandler = exports.getUtilityHandler = exports.getUtilitiesHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
const utility_service_1 = require("./utility.service");
exports.getUtilitiesHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const utilities = await (0, utility_service_1.findUtilitiesByFilterQuery)({ businessId });
    res.json((0, SuccessResponse_1.default)({ utilities }));
});
exports.getUtilityHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['utilityId'] === 'string') {
        const utility = await (0, utility_service_1.findUtilityById)(new mongoose_1.default.Types.ObjectId(req.params['utilityId']));
        res.json((0, SuccessResponse_1.default)({ utility }));
    }
});
exports.createUtilityHandler = (0, utils_1.catchAsync)(async (req, res) => {
    const businessId = (0, utils_1.extractBusinessId)(req);
    const utility = await (0, utility_service_1.createUtility)(Object.assign(Object.assign({}, req.body), { businessId }));
    res.status(http_status_1.default.CREATED).send((0, SuccessResponse_1.default)({ utility }));
});
exports.updateUtilityHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['utilityId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        const utility = await (0, utility_service_1.updateUtilityById)(new mongoose_1.default.Types.ObjectId(req.params['utilityId']), Object.assign(Object.assign({}, req.body), { businessId }));
        res.status(http_status_1.default.OK).send((0, SuccessResponse_1.default)({ utility }));
    }
});
exports.deleteUtilityHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.query['utilityId'] === 'string') {
        const businessId = (0, utils_1.extractBusinessId)(req);
        await (0, utility_service_1.deleteUtilitiesById)(req.query['utilityId'], businessId);
        res.send((0, SuccessResponse_1.default)());
    }
});
//# sourceMappingURL=utility.controller.js.map