import httpStatus from 'http-status';
import mongoose, { FilterQuery } from 'mongoose';
import { IUtilityDoc, NewUtility } from './utility.interfaces';
import Utility from './utility.model';
import { ApiError } from '../errors';

export const findUtilitiesByFilterQuery = async (filterQuery: FilterQuery<IUtilityDoc>): Promise<IUtilityDoc[]> =>
  Utility.find(filterQuery);

export const findUtilityById = async (id: mongoose.Types.ObjectId): Promise<IUtilityDoc | null> => Utility.findById(id);

export const findUtilityByFilterQuery = async (filterQuery: FilterQuery<IUtilityDoc>): Promise<IUtilityDoc | null> =>
  Utility.findOne(filterQuery);

export const findUtilityByIdAndBusinessId = async (
  _id: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
): Promise<IUtilityDoc | null> => {
  return findUtilityByFilterQuery({ _id, businessId });
};

export const createUtility = async (utilityBody: NewUtility) => {
  const utility = await Utility.create(utilityBody);
  return utility;
};

export const updateUtilityById = async (utilityId: mongoose.Types.ObjectId, utilityBody: NewUtility) => {
  const utility = await findUtilityById(utilityId);
  if (!utility) throw new ApiError(httpStatus.NOT_FOUND, 'Utility not found.');

  Object.assign(utility, utilityBody);
  await utility.save();
  return utility;
};
