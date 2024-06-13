"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const utility_1 = require("../../modules/utility");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), utility_1.utilityController.getUtilitiesHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(utility_1.utilityValidation.createUtilityPayloadSchema), utility_1.utilityController.createUtilityHandler);
router
    .route('/:utilityId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(utility_1.utilityValidation.getUtilityPayloadSchema), utility_1.utilityController.getUtilityHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(utility_1.utilityValidation.updateUtilityPayloadSchema), utility_1.utilityController.updateUtilityHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(utility_1.utilityValidation.deleteUtilityPayloadSchema), utility_1.utilityController.deleteUtilityHandler);
exports.default = router;
//# sourceMappingURL=utility.route.js.map