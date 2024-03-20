// import mongoose from 'mongoose';
// import httpStatus from 'http-status';
// import { Request, Response } from 'express';
// import { catchAsync, extractBusinessId } from '../utils';
// import createSuccessResponse from '../success/SuccessResponse';
// import { createUtility, updateUtilityById } from './utilityPayment.service';

// export const createUtilityHandler = catchAsync(async (req: Request, res: Response) => {
//   const businessId = extractBusinessId(req);
//   const utility = await createUtility({ ...req.body, businessId });
//   res.status(httpStatus.CREATED).send(createSuccessResponse({ utility }));
// });

// export const updateUtilityHandler = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params['utilityId'] === 'string') {
//     const businessId = extractBusinessId(req);
//     const utility = await updateUtilityById(new mongoose.Types.ObjectId(req.params['utilityId']), {
//       ...req.body,
//       businessId,
//     });

//     res.status(httpStatus.OK).send(createSuccessResponse({ utility }));
//   }
// });
