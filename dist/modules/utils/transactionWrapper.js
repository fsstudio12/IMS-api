"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const runInTransaction = async (callback) => {
    var _a, _b;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        await callback(session);
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw new errors_1.ApiError((_a = error.statusCode) !== null && _a !== void 0 ? _a : http_status_1.default.INTERNAL_SERVER_ERROR, (_b = error.message) !== null && _b !== void 0 ? _b : 'Something went wrong.');
    }
    finally {
        session.endSession();
    }
};
exports.default = runInTransaction;
//# sourceMappingURL=transactionWrapper.js.map