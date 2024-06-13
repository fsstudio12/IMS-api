"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const department_1 = require("../../modules/department");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), department_1.departmentController.getDepartmentsHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(department_1.departmentValidation.createDepartmentSchema), department_1.departmentController.createDepartmentHandler);
router.post('/admin', department_1.departmentController.createBusinessAdminHandler);
router
    .route('/:departmentId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(department_1.departmentValidation.getDepartmentSchema), department_1.departmentController.getDepartmentHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(department_1.departmentValidation.updateDepartmentSchema), department_1.departmentController.updateDepartmentHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(department_1.departmentValidation.deleteDepartmentSchema), department_1.departmentController.deleteDepartmentHandler);
exports.default = router;
//# sourceMappingURL=department.route.js.map