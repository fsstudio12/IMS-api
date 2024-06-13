"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const customer_1 = require("../../modules/customer");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), customer_1.customerController.getCustomersHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(customer_1.customerValidation.createCustomerSchema), customer_1.customerController.createCustomerHandler);
router
    .route('/:customerId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(customer_1.customerValidation.getCustomerSchema), customer_1.customerController.getCustomerHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(customer_1.customerValidation.updateCustomerSchema), customer_1.customerController.updateCustomerHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(customer_1.customerValidation.deleteCustomerSchema), customer_1.customerController.deleteCustomerHandler);
exports.default = router;
//# sourceMappingURL=customer.route.js.map