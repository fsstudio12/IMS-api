"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const utilityPayment_1 = require("../../modules/utilityPayment");
const utilityPayment_validation_1 = require("../../modules/utilityPayment/utilityPayment.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), utilityPayment_1.utilityPaymentController.getUtilityPaymentsHandler)
    .post((0, auth_1.auth)(), utilityPayment_1.utilityPaymentController.createUtilityPaymentHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(utilityPayment_validation_1.deleteUtilityPaymentSchema), utilityPayment_1.utilityPaymentController.deleteUtilityPaymentsHandler);
router
    .route('/:utilityPaymentId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(utilityPayment_validation_1.getUtilityPaymentSchema), utilityPayment_1.utilityPaymentController.getUtilityPaymentHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(utilityPayment_validation_1.updateUtilityPaymentPayloadSchema), utilityPayment_1.utilityPaymentController.updateUtilityPaymentHandler);
exports.default = router;
//# sourceMappingURL=utilityPayment.route.js.map