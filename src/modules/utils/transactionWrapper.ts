import mongoose, { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';

type TransactionCallback = (session: ClientSession) => Promise<void>;

const runInTransaction = async (callback: TransactionCallback) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    await callback(session);
    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw new ApiError(error.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR, error.message ?? 'Something went wrong.');
  } finally {
    session.endSession();
  }
};

export default runInTransaction;
