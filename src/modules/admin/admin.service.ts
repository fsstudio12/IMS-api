import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { findEmployeeById } from '../employee/employee.service';
import { ApiError } from '../errors';

export const toggleVerifyUser = async (userId: mongoose.Types.ObjectId) => {
  const user = await findEmployeeById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  user.isVerified = !user.isVerified;
  await user.save();
};

export const toggleBanUser = async (userId: mongoose.Types.ObjectId) => {
  const user = await findEmployeeById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  user.isBanned = !user.isBanned;
  await user.save();
};
