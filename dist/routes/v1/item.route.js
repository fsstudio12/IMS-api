"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const item_1 = require("../../modules/item");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), item_1.itemController.getItemsHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(item_1.itemValidation.createItemSchema), item_1.itemController.createItemHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(item_1.itemValidation.deleteItemSchema), item_1.itemController.deleteItemHandler);
router
    .route('/:itemId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(item_1.itemValidation.getItemSchema), item_1.itemController.getItemHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(item_1.itemValidation.updateItemSchema), item_1.itemController.updateItemHandler);
router.route('/table/list').get((0, auth_1.auth)(), item_1.itemController.itemTableListHandler);
exports.default = router;
//# sourceMappingURL=item.route.js.map