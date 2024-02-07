import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { categoryController, categoryValidation } from '../../modules/category';
import { auth } from '../../modules/auth';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), validate(categoryValidation.getCategoriesSchema), categoryController.getCategoriesHandler)
  .post(auth(), validate(categoryValidation.createCategorySchema), categoryController.createCategoryHandler);

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidation.getCategorySchema), categoryController.getCategoryHandler)
  .patch(auth(), validate(categoryValidation.updateCategorySchema), categoryController.updateCategoryHandler)
  .delete(auth(), validate(categoryValidation.deleteCategorySchema), categoryController.deleteCategoryHandler);

export default router;
