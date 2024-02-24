import express, { Router } from 'express';

const router: Router = express.Router();

router.route('/').post();

export default router;
