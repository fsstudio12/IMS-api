"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const extractBusinessId = (req) => {
    const { employee, body } = req;
    const businessId = (employee === null || employee === void 0 ? void 0 : employee.business._id) || body.businessId;
    if (!businessId) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Please select a business.');
    }
    return new mongoose_1.default.Types.ObjectId(businessId);
};
exports.default = extractBusinessId;
//# sourceMappingURL=businessIdExtractor.js.map