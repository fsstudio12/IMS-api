import httpStatus from 'http-status';
import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUser, IUserDoc, NewRegisteredUser } from './user.interfaces';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  return User.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser, session: ClientSession): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  const [user] = await User.create([{ ...userBody, role: 'admin' }], { session });
  if (!user) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const findUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const findUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUser} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (userId: mongoose.Types.ObjectId, updateBody: UpdateUser): Promise<IUserDoc | null> => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId)))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  await user.deleteOne();
  return user;
};

export const getUsersByFilterQuery = async (filterQuery: FilterQuery<IUserDoc>): Promise<IUserDoc[]> =>
  User.aggregate([
    {
      $match: filterQuery,
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        role: 1,
        isEmailVerified: 1,
        createdAt: 1,
      },
    },
  ]);

export const getUsersByRole = async (user: IUserDoc): Promise<IUserDoc[]> => {
  let filterQuery: FilterQuery<IUserDoc> = {};
  if (user.role !== 'super_admin') {
    filterQuery = {
      businessId: user.businessId,
    };
    if (user.role !== 'admin') {
      filterQuery = { ...filterQuery, role: { $ne: 'admin' } };
    }
  }

  const employees = await getUsersByFilterQuery(filterQuery);
  return employees;
};