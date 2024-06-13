"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../modules/auth");
const validate_1 = require("../../modules/validate");
const recipe_1 = require("../../modules/recipe");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.auth)(), recipe_1.recipeController.getRecipesHandler)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(recipe_1.recipeValidation.createRecipeSchema), recipe_1.recipeController.createRecipeHandler);
router
    .route('/:recipeId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(recipe_1.recipeValidation.getRecipeSchema), recipe_1.recipeController.getRecipeHandler)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(recipe_1.recipeValidation.updateRecipeSchema), recipe_1.recipeController.updateRecipeHandler)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(recipe_1.recipeValidation.deleteRecipeSchema), recipe_1.recipeController.deleteRecipeHandler);
router.route('/table/list').get((0, auth_1.auth)(), recipe_1.recipeController.recipeTableListHandler);
exports.default = router;
//# sourceMappingURL=recipe.route.js.map