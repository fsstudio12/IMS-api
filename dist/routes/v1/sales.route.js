"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const sales_1 = require("../../modules/sales");
const router = express_1.default.Router();
router.route('/').get((0, auth_1.auth)(), sales_1.salesController.getSalesHandler).post((0, auth_1.auth)(), 
// validate(salesValidation.createSalesSchema),
sales_1.salesController.createSalesHandler);
router
    .route('/:salesId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(sales_1.salesValidation.getSalesSchema), sales_1.salesController.getSingleSalesHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(sales_1.salesValidation.updateSalesSchema), sales_1.salesController.updateSalesHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(sales_1.salesValidation.deleteSalesSchema), sales_1.salesController.deleteSalesHandler);
router
    .route('/payments/:salesId')
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(sales_1.salesValidation.addSalesPaymentSchema), sales_1.salesController.addSalesPaymentHandler);
router
    .route('/payments/:salesId/:paymentId')
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(sales_1.salesValidation.updateSalesPaymentSchema), sales_1.salesController.updateSalesPaymentHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(sales_1.salesValidation.deleteSalesPaymentSchema), sales_1.salesController.removeSalesPaymentHandler);
exports.default = router;
//# sourceMappingURL=sales.route.js.map