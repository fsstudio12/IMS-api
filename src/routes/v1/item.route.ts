import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { itemController, itemValidation } from '../../modules/item';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), itemController.getItemsHandler)
  .post(auth(), validate(itemValidation.createItemSchema), itemController.createItemHandler)
  .delete(auth(), validate(itemValidation.deleteItemSchema), itemController.deleteItemHandler);

router
  .route('/:itemId')
  .get(auth(), validate(itemValidation.getItemSchema), itemController.getItemHandler)
  .patch(auth(), validate(itemValidation.updateItemSchema), itemController.updateItemHandler);

router.route('/table/list').get(auth(), itemController.itemTableListHandler);

export default router;
