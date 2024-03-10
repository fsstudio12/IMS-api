import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { vendorController, vendorValidation } from '../../modules/vendor';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), vendorController.getVendorsHandler)
  .post(auth(), validate(vendorValidation.createVendorSchema), vendorController.createVendorHandler);

router
  .route('/:vendorId')
  .get(auth(), validate(vendorValidation.getVendorSchema), vendorController.getVendorHandler)
  .patch(auth(), validate(vendorValidation.updateVendorSchema), vendorController.updateVendorHandler)
  .delete(auth(), validate(vendorValidation.deleteVendorSchema), vendorController.deleteVendorHandler);

router
  .route('/history/:vendorId')
  .get(auth(), validate(vendorValidation.getVendorSchema), vendorController.getVendorHistoryHandler);

export default router;
