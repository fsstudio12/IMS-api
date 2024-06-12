import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { purchaseController, purchaseValidation } from '../../modules/purchase';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), purchaseController.getPurchasesHandler)
  .post(auth(), validate(purchaseValidation.createPurchaseSchema), purchaseController.createPurchaseHandler);

router
  .route('/:purchaseId')
  .get(auth(), validate(purchaseValidation.getPurchaseSchema), purchaseController.getPurchaseHandler)
  .patch(auth(), validate(purchaseValidation.updatePurchaseSchema), purchaseController.updatePurchaseHandler)
  .delete(auth(), validate(purchaseValidation.deletePurchaseSchema), purchaseController.deletePurchaseHandler);

router
  .route('/payments/:purchaseId')
  .patch(auth(), validate(purchaseValidation.addPurchasePaymentSchema), purchaseController.addPurchasePaymentHandler);

router
  .route('/payments/:purchaseId/:paymentId')
  .patch(auth(), validate(purchaseValidation.updatePurchasePaymentSchema), purchaseController.updatePurchasePaymentHandler)
  .delete(auth(), validate(purchaseValidation.deletePurchasePaymentSchema), purchaseController.removePurchasePaymentHandler);

export default router;
