"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../../modules/admin");
const router = express_1.default.Router();
router.post('/:userId/verify', admin_1.adminController.toggleVerifyUserHandler);
router.post('/:userId/ban', admin_1.adminController.toggleBanUserHandler);
exports.default = router;
//# sourceMappingURL=admin.route.js.map