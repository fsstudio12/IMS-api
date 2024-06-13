"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const purchase_1 = require("../../modules/purchase");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), purchase_1.purchaseController.getPurchasesHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.createPurchaseSchema), purchase_1.purchaseController.createPurchaseHandler);
router
    .route('/:purchaseId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.getPurchaseSchema), purchase_1.purchaseController.getPurchaseHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.updatePurchaseSchema), purchase_1.purchaseController.updatePurchaseHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.deletePurchaseSchema), purchase_1.purchaseController.deletePurchaseHandler);
router
    .route('/payments/:purchaseId')
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.addPurchasePaymentSchema), purchase_1.purchaseController.addPurchasePaymentHandler);
router
    .route('/payments/:purchaseId/:paymentId')
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.updatePurchasePaymentSchema), purchase_1.purchaseController.updatePurchasePaymentHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(purchase_1.purchaseValidation.deletePurchasePaymentSchema), purchase_1.purchaseController.removePurchasePaymentHandler);
exports.default = router;
//# sourceMappingURL=purchase.route.js.map