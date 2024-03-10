import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { recipeController, recipeValidation } from '../../modules/recipe';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), recipeController.getRecipesHandler)
  .post(auth(), validate(recipeValidation.createRecipeSchema), recipeController.createRecipeHandler);

router
  .route('/:recipeId')
  .get(auth(), validate(recipeValidation.getRecipeSchema), recipeController.getRecipeHandler)
  .patch(auth(), validate(recipeValidation.updateRecipeSchema), recipeController.updateRecipeHandler)
  .delete(auth(), validate(recipeValidation.deleteRecipeSchema), recipeController.deleteRecipeHandler);

router.route('/table/list').get(auth(), recipeController.recipeTableListHandler);

export default router;
