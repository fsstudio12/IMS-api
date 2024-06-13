"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUtilityPayloadSchema = exports.updateUtilityPayloadSchema = exports.createUtilityPayloadSchema = exports.getUtilityPayloadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validate_1 = require("../validate");
const utilityPayloadSchema = {
    title: joi_1.default.string(),
};
exports.getUtilityPayloadSchema = {
    params: joi_1.default.object().keys({
        utilityId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
exports.createUtilityPayloadSchema = {
    body: joi_1.default.object().keys(utilityPayloadSchema),
};
exports.updateUtilityPayloadSchema = Object.assign({ params: joi_1.default.object().keys({
        utilityId: joi_1.default.string().custom(validate_1.objectId),
    }) }, exports.createUtilityPayloadSchema);
exports.deleteUtilityPayloadSchema = {
    params: joi_1.default.object().keys({
        utilityId: joi_1.default.string().custom(validate_1.objectId),
    }),
};
//# sourceMappingURL=utility.validation.js.map