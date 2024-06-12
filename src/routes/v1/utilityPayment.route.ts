import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { utilityPaymentController } from '../../modules/utilityPayment';
import {
  getUtilityPaymentSchema,
  updateUtilityPaymentPayloadSchema,
  deleteUtilityPaymentSchema,
} from '../../modules/utilityPayment/utilityPayment.validation';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), utilityPaymentController.getUtilityPaymentsHandler)
  .post(auth(), utilityPaymentController.createUtilityPaymentHandler)
  .delete(auth(), validate(deleteUtilityPaymentSchema), utilityPaymentController.deleteUtilityPaymentsHandler);

router
  .route('/:utilityPaymentId')
  .get(auth(), validate(getUtilityPaymentSchema), utilityPaymentController.getUtilityPaymentHandler)
  .patch(auth(), validate(updateUtilityPaymentPayloadSchema), utilityPaymentController.updateUtilityPaymentHandler);

export default router;
