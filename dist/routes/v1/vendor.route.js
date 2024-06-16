"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const vendor_1 = require("../../modules/vendor");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), vendor_1.vendorController.getVendorsHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(vendor_1.vendorValidation.createVendorSchema), vendor_1.vendorController.createVendorHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(vendor_1.vendorValidation.deleteVendorSchema), vendor_1.vendorController.deleteVendorHandler);
router
    .route('/:vendorId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(vendor_1.vendorValidation.getVendorSchema), vendor_1.vendorController.getVendorHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(vendor_1.vendorValidation.updateVendorSchema), vendor_1.vendorController.updateVendorHandler);
router
    .route('/history/:vendorId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(vendor_1.vendorValidation.getVendorSchema), vendor_1.vendorController.getVendorHistoryHandler);
exports.default = router;
//# sourceMappingURL=vendor.route.js.map