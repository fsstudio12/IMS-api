import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';

import { ApiError } from '../errors';
import { IWastageDoc, NewWastage, UpdateWastage } from './wastage.interfaces';
import Wastage from './wastage.model';
import { common } from '../utils';

export const findWastagesByFilterQuery = async (filterQuery: FilterQuery<IWastageDoc>): Promise<IWastageDoc[]> =>
  Wastage.find(filterQuery);

export const findWastageById = async (wastageId: mongoose.Types.ObjectId): Promise<IWastageDoc | null> =>
  Wastage.findById(wastageId);

export const findWastageByFilterQuery = async (filterQuery: FilterQuery<IWastageDoc>): Promise<IWastageDoc | null> =>
  Wastage.findOne(filterQuery);

export const createWastage = (createWastageBody: NewWastage) => {
  return Wastage.create(createWastageBody);
};

export const updateWastageById = async (wastageId: mongoose.Types.ObjectId, updateWastageBody: UpdateWastage) => {
  const wastage = await findWastageById(wastageId);
  if (!wastage) throw new ApiError(httpStatus.NOT_FOUND, 'Wastage not found.');

  Object.assign(wastage, updateWastageBody);
  await wastage.save();

  return wastage;
};

export const deleteWastageById = async (queryWastageIds: string, businessId?: mongoose.Types.ObjectId) => {
  const wastageIds = common
    .splitFromQuery(queryWastageIds)
    .map((wastageId: string) => new mongoose.Types.ObjectId(wastageId));

  const matchQuery: FilterQuery<IWastageDoc> = {
    _id: { $in: wastageIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  // const wastages = await findWastagesByFilterQuery(matchQuery);
  // // update inventory

  await Wastage.deleteMany(matchQuery);
};
