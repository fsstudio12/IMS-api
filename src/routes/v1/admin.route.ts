import express, { Router } from 'express';
import { adminController } from '../../modules/admin';

const router: Router = express.Router();

router.post('/:userId/verify', adminController.toggleVerifyUserHandler);

router.post('/:userId/ban', adminController.toggleBanUserHandler);

export default router;
