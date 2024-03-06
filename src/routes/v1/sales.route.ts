import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { salesController, salesValidation } from '../../modules/sales';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), salesController.getSalesHandler)
  .post(auth(), validate(salesValidation.createSalesSchema), salesController.createSalesHandler);

router
  .route('/:salesId')
  .get(auth(), validate(salesValidation.getSalesSchema), salesController.getSalesHandler)
  .patch(auth(), validate(salesValidation.updateSalesSchema), salesController.updateSalesHandler)
  .delete(auth(), validate(salesValidation.deleteSalesSchema), salesController.deleteSalesHandler);

router
  .route('/payments/:salesId')
  .patch(auth(), validate(salesValidation.addSalesPaymentSchema), salesController.addSalesPaymentHandler);

router
  .route('/payments/:salesId/:paymentId')
  .patch(auth(), validate(salesValidation.updateSalesPaymentSchema), salesController.updateSalesPaymentHandler)
  .delete(auth(), validate(salesValidation.deleteSalesPaymentSchema), salesController.removeSalesPaymentHandler);

export default router;
