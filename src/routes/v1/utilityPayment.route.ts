import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { utilityPaymentController } from '../../modules/utilityPayment';
import {
  getUtilityPaymentSchema,
  createUtilityPaymentPayloadSchema,
  updateUtilityPaymentPayloadSchema,
  deleteUtilityPaymentSchema,
} from '../../modules/utilityPayment/utilityPayment.validation';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), utilityPaymentController.getUtilityPaymentsHandler)
  .post(auth(), validate(createUtilityPaymentPayloadSchema), utilityPaymentController.createUtilityPaymentHandler);

router
  .route('/:id')
  .get(auth(), validate(getUtilityPaymentSchema), utilityPaymentController.getUtilityPaymentHandler)
  .patch(auth(), validate(updateUtilityPaymentPayloadSchema), utilityPaymentController.updateUtilityPaymentHandler)
  .delete(auth(), validate(deleteUtilityPaymentSchema), utilityPaymentController.deleteUtilityPaymentsHandler);

export default router;
