"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBanUserHandler = exports.toggleVerifyUserHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const admin_service_1 = require("./admin.service");
const SuccessResponse_1 = __importDefault(require("../success/SuccessResponse"));
exports.toggleVerifyUserHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        await (0, admin_service_1.toggleVerifyUser)(new mongoose_1.default.Types.ObjectId(req.params['userId']));
        res.send((0, SuccessResponse_1.default)());
    }
});
exports.toggleBanUserHandler = (0, utils_1.catchAsync)(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        await (0, admin_service_1.toggleBanUser)(new mongoose_1.default.Types.ObjectId(req.params['userId']));
        res.send((0, SuccessResponse_1.default)());
    }
});
//# sourceMappingURL=admin.controller.js.map