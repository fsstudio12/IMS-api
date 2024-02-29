import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { customerController, customerValidation } from '../../modules/customer';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), customerController.getCustomersHandler)
  .post(auth(), validate(customerValidation.createCustomerSchema), customerController.createCustomerHandler);

router
  .route('/:customerId')
  .get(auth(), validate(customerValidation.getCustomerSchema), customerController.getCustomerHandler)
  .patch(auth(), validate(customerValidation.updateCustomerSchema), customerController.updateCustomerHandler)
  .delete(auth(), validate(customerValidation.deleteCustomerSchema), customerController.deleteCustomerHandler);

export default router;
