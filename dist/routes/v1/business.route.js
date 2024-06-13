"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const business_1 = require("../../modules/business");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)(), (0, validate_1.validate)(auth_1.authValidation.registerSchema), auth_1.authController.registerHandler)
    .get((0, auth_1.auth)(), (0, validate_1.validate)(business_1.businessValidation.getBusinessesSchema), business_1.businessController.getBusinessesHandler);
router
    .route('/:businessId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(business_1.businessValidation.getBusinessSchema), business_1.businessController.getBusinessHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(business_1.businessValidation.updateBusinessSchema), business_1.businessController.updateBusinessHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(business_1.businessValidation.deleteBusinessSchema), business_1.businessController.deleteBusinessHandler);
exports.default = router;
//# sourceMappingURL=business.route.js.map