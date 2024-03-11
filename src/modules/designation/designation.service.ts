import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import Designation from './designation.model';
import { IDesignation, IDesignationDoc } from './designation.interfaces';

export const getDesignationsWithMatchQuery = async (
  matchQuery: FilterQuery<IDesignationDoc>
): Promise<IDesignationDoc[]> => {
  return Designation.aggregate([
    {
      $match: matchQuery,
    },
  ]);
};

export const getDesignationsByBusinessId = async (businessId: mongoose.Types.ObjectId): Promise<IDesignationDoc[]> =>
  getDesignationsWithMatchQuery({ businessId });

export const findDesignationsByFilterQuery = async (filterQuery: FilterQuery<IDesignationDoc>): Promise<IDesignationDoc[]> =>
  Designation.find(filterQuery);

export const findDesignationById = async (id: mongoose.Types.ObjectId): Promise<IDesignationDoc | null> =>
  Designation.findById(id);

export const findDesignationByFilterQuery = async (
  filterQuery: FilterQuery<IDesignationDoc>
): Promise<IDesignationDoc | null> => Designation.findOne(filterQuery);

/**
 * Create a designation
 * @param {NewDesignation} createDesignationBody
 * @returns {Promise<IDesignationDoc>}
 */
export const createDesignation = async (createDesignationBody: IDesignation): Promise<IDesignationDoc> => {
  if (await Designation.isNameTaken(createDesignationBody.name, createDesignationBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Designation with the entered name already exists.');

  return Designation.create(createDesignationBody);
};

export const updateDesignationById = async (
  designationId: mongoose.Types.ObjectId,
  updateDesignationBody: IDesignation
): Promise<IDesignationDoc | null> => {
  const designation = await findDesignationById(designationId);
  if (!designation) throw new ApiError(httpStatus.NOT_FOUND, 'Designation not found.');

  if (await Designation.isNameTaken(updateDesignationBody.name, updateDesignationBody.businessId, designation._id))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Another designation with the entered name already exists.');

  Object.assign(designation, updateDesignationBody);
  await designation.save();
  return designation;
};

export const deleteDesignationById = async (designationId: mongoose.Types.ObjectId): Promise<IDesignationDoc | null> => {
  const designation = await findDesignationById(designationId);
  if (!designation) throw new ApiError(httpStatus.NOT_FOUND, 'Designation not found.');

  await designation.deleteOne();
  return designation;
};
