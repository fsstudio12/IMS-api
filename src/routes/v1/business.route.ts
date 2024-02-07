import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth, authController, authValidation } from '../../modules/auth';
import { businessController, businessValidation } from '../../modules/business';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(authValidation.registerSchema), authController.registerHandler)
  .get(auth(), validate(businessValidation.getBusinessesSchema), businessController.getBusinessesHandler);

router
  .route('/:businessId')
  .get(auth(), validate(businessValidation.getBusinessSchema), businessController.getBusinessHandler)
  .patch(auth(), validate(businessValidation.updateBusinessSchema), businessController.updateBusinessHandler)
  .delete(auth(), validate(businessValidation.deleteBusinessSchema), businessController.deleteBusinessHandler);

export default router;
