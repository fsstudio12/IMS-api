import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { itemController, itemValidation } from '../../modules/item';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), itemController.getItemsHandler)
  .post(auth(), validate(itemValidation.createItemSchema), itemController.createItemHandler);

router
  .route('/:itemId')
  .get(auth(), validate(itemValidation.getItemSchema), itemController.getItemHandler)
  .patch(auth(), validate(itemValidation.updateItemSchema), itemController.updateItemHandler)
  .delete(auth(), validate(itemValidation.deleteItemSchema), itemController.deleteItemHandler);

export default router;
