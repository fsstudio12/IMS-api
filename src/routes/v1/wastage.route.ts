import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { wastageController, wastageValidation } from '../../modules/wastage';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), wastageController.getWastagesHandler)
  .post(auth(), validate(wastageValidation.createWastageSchema), wastageController.createWastageHandler);

router
  .route('/filter')
  .get(auth(), validate(wastageValidation.filterWastageSchema), wastageController.filterWastagesHandler);

router
  .route('/:wastageId')
  .get(auth(), validate(wastageValidation.getWastageSchema), wastageController.getWastageHandler)
  .patch(auth(), validate(wastageValidation.updateWastageSchema), wastageController.updateWastageHandler)
  .delete(auth(), validate(wastageValidation.deleteWastageSchema), wastageController.deleteWastageHandler);

export default router;
