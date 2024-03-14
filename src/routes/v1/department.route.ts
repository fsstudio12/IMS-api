import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { departmentController, departmentValidation } from '../../modules/department';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), departmentController.getDepartmentsHandler)
  .post(auth(), validate(departmentValidation.createDepartmentSchema), departmentController.createDepartmentHandler);

router.post('/admin', departmentController.createBusinessAdminHandler);

router
  .route('/:departmentId')
  .get(auth(), validate(departmentValidation.getDepartmentSchema), departmentController.getDepartmentHandler)
  .patch(auth(), validate(departmentValidation.updateDepartmentSchema), departmentController.updateDepartmentHandler)
  .delete(auth(), validate(departmentValidation.deleteDepartmentSchema), departmentController.deleteDepartmentHandler);

export default router;
