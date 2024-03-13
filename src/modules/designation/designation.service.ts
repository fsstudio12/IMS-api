import mongoose, { FilterQuery, ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import Designation from './designation.model';
import { IDesignation, IDesignationDoc } from './designation.interfaces';
import { splitFromQuery } from '../utils/common';
import Resource from '../../config/resources';
import Action from '../../config/actions';

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
export const createDesignation = async (
  createDesignationBody: IDesignation,
  session: ClientSession | null
): Promise<IDesignationDoc> => {
  if (await Designation.isTitleTaken(createDesignationBody.title, createDesignationBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Designation with the entered title already exists.');

  const options = session ? { session } : undefined;

  const [designation] = await Designation.create([createDesignationBody], options);
  if (!designation) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong.');

  return designation;
};

export const updateDesignationById = async (
  designationId: mongoose.Types.ObjectId,
  updateDesignationBody: IDesignation
): Promise<IDesignationDoc | null> => {
  const designation = await findDesignationById(designationId);
  if (!designation) throw new ApiError(httpStatus.NOT_FOUND, 'Designation not found.');

  if (await Designation.isTitleTaken(updateDesignationBody.title, updateDesignationBody.businessId, designation._id))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Another designation with the entered title already exists.');

  Object.assign(designation, updateDesignationBody);
  await designation.save();
  return designation;
};

export const deleteDesignationsById = async (
  queryDesignationIds: string,
  businessId?: mongoose.Types.ObjectId
): Promise<void> => {
  const designationIds = splitFromQuery(queryDesignationIds);
  const mappedDesignationIds = designationIds.map((designationId: string) => {
    return new mongoose.Types.ObjectId(designationId);
  });

  const matchQuery: FilterQuery<IDesignationDoc> = {
    _id: { $in: mappedDesignationIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  // const employeesToUpdate = (
  //   await Designation.aggregate([
  //     {
  //       $match: {
  //         $in: mappedDesignationIds,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'employees',
  //         localField: '_id',
  //         foreignField: 'designationId',
  //         as: 'employees',
  //         pipeline: [
  //           {
  //             $project: {
  //               _id: 1,
  //               title: 1,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   ])
  // ).map((employee: any) => employee._id);

  await Designation.deleteMany(matchQuery);
};

export const createAdminDesignationForBusiness = async (
  businessId: mongoose.Types.ObjectId,
  session: ClientSession | null
): Promise<IDesignationDoc> => {
  const adminPermissions: any = {};
  for (const resource of Object.values(Resource)) {
    adminPermissions[resource] = [Action.ALL];
  }

  const designation = await createDesignation(
    {
      title: 'Admin',
      permissions: adminPermissions,
      businessId,
    },
    session
  );

  return designation;
};
