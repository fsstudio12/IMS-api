import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { findUserById } from '../user/user.service';
import { ApiError } from '../errors';

export const toggleVerifyUser = async (userId: mongoose.Types.ObjectId) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  user.isVerified = !user.isVerified;
  await user.save();
};

export const toggleBanUser = async (userId: mongoose.Types.ObjectId) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  user.isBanned = !user.isBanned;
  await user.save();
};
