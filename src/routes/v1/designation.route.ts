import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { designationController, designationValidation } from '../../modules/designation';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), designationController.getDesignationsHandler)
  .post(auth(), validate(designationValidation.createDesignationSchema), designationController.createDesignationHandler);

router
  .route('/:designationId')
  .get(auth(), validate(designationValidation.getDesignationSchema), designationController.getDesignationHandler)
  .patch(auth(), validate(designationValidation.updateDesignationSchema), designationController.updateDesignationHandler)
  .delete(auth(), validate(designationValidation.deleteDesignationSchema), designationController.deleteDesignationHandler);

export default router;
