import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { categoryController, categoryValidation } from '../../modules/category';

const router: Router = express.Router();

router
  .route('/')
  .get(validate(categoryValidation.getCategoriesSchema), categoryController.getCategoriesHandler)
  .post(validate(categoryValidation.createCategorySchema), categoryController.createCategoryHandler);

router
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategorySchema), categoryController.getCategoriesHandler)
  .patch(validate(categoryValidation.updateCategorySchema), categoryController.updateCategoryHandler)
  .delete(validate(categoryValidation.deleteCategorySchema), categoryController.deleteCategoryHandler);

export default router;
