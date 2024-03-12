import { Request } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';

const extractBusinessId = (req: Request): mongoose.Types.ObjectId => {
  const { employee, body } = req;

  const businessId = employee?.businessId || body.businessId;

  if (!businessId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');
  }

  return new mongoose.Types.ObjectId(businessId);
};

export default extractBusinessId;
