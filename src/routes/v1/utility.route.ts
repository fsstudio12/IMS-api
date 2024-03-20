import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { utilityController, utilityValidation } from '../../modules/utility';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), utilityController.getUtilitiesHandler)
  .post(auth(), validate(utilityValidation.createUtilityPayloadSchema), utilityController.createUtilityHandler);

router
  .route('/:utilityId')
  .get(auth(), validate(utilityValidation.getUtilityPayloadSchema), utilityController.getUtilityHandler)
  .patch(auth(), validate(utilityValidation.updateUtilityPayloadSchema), utilityController.updateUtilityHandler)
  .delete(auth(), validate(utilityValidation.deleteUtilityPayloadSchema), utilityController.deleteUtilityHandler);

export default router;
