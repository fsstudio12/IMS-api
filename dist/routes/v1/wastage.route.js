"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const wastage_1 = require("../../modules/wastage");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), wastage_1.wastageController.getWastagesHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(wastage_1.wastageValidation.createWastageSchema), wastage_1.wastageController.createWastageHandler);
router
    .route('/filter')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(wastage_1.wastageValidation.filterWastageSchema), wastage_1.wastageController.filterWastagesHandler);
router
    .route('/:wastageId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(wastage_1.wastageValidation.getWastageSchema), wastage_1.wastageController.getWastageHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(wastage_1.wastageValidation.updateWastageSchema), wastage_1.wastageController.updateWastageHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(wastage_1.wastageValidation.deleteWastageSchema), wastage_1.wastageController.deleteWastageHandler);
exports.default = router;
//# sourceMappingURL=wastage.route.js.map