import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { getUserById } from '../user/user.service';
import { ApiError } from '../errors';

export const toggleVerifyUser = async (userId: mongoose.Types.ObjectId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  user.isVerified = !user.isVerified;
  await user.save();
};

export const toggleBanUser = async (userId: mongoose.Types.ObjectId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  user.isBanned = !user.isBanned;
  await user.save();
};

export const testService = async () => {
  console.log('test');
};
