import mongoose, { FilterQuery, ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import Department from './department.model';
import { IDepartment, IDepartmentDoc } from './department.interfaces';
import { splitFromQuery } from '../utils/common';
import Resource from '../../config/resources';
import Action from '../../config/actions';

export const getDepartmentsWithMatchQuery = async (matchQuery: FilterQuery<IDepartmentDoc>): Promise<IDepartmentDoc[]> => {
  return Department.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: 'employees',
        localField: '_id',
        foreignField: 'departmentId',
        as: 'employees',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        numberOfEmployees: {
          $size: '$employees',
        },
      },
    },
  ]);
};

export const getDepartmentsByBusinessId = async (businessId: mongoose.Types.ObjectId): Promise<IDepartmentDoc[]> =>
  getDepartmentsWithMatchQuery({ businessId });

export const findDepartmentsByFilterQuery = async (filterQuery: FilterQuery<IDepartmentDoc>): Promise<IDepartmentDoc[]> =>
  Department.find(filterQuery);

export const findDepartmentById = async (id: mongoose.Types.ObjectId): Promise<IDepartmentDoc | null> =>
  Department.findById(id);

export const findDepartmentByFilterQuery = async (
  filterQuery: FilterQuery<IDepartmentDoc>
): Promise<IDepartmentDoc | null> => Department.findOne(filterQuery);

/**
 * Create a department
 * @param {NewDepartment} createDepartmentBody
 * @returns {Promise<IDepartmentDoc>}
 */
export const createDepartment = async (
  createDepartmentBody: IDepartment,
  session: ClientSession | null
): Promise<IDepartmentDoc> => {
  if (await Department.isTitleTaken(createDepartmentBody.title, createDepartmentBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Department with the entered title already exists.');

  const options = session ? { session } : undefined;

  const [department] = await Department.create([createDepartmentBody], options);
  if (!department) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong.');

  return department;
};

export const updateDepartmentById = async (
  departmentId: mongoose.Types.ObjectId,
  updateDepartmentBody: IDepartment
): Promise<IDepartmentDoc | null> => {
  const department = await findDepartmentById(departmentId);
  if (!department) throw new ApiError(httpStatus.NOT_FOUND, 'Department not found.');

  if (await Department.isTitleTaken(updateDepartmentBody.title, updateDepartmentBody.businessId, department._id))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Another department with the entered title already exists.');

  Object.assign(department, updateDepartmentBody);
  await department.save();
  return department;
};

export const deleteDepartmentsById = async (
  queryDepartmentIds: string,
  businessId?: mongoose.Types.ObjectId
): Promise<void> => {
  const departmentIds = splitFromQuery(queryDepartmentIds);
  const mappedDepartmentIds = departmentIds.map((departmentId: string) => {
    return new mongoose.Types.ObjectId(departmentId);
  });

  const matchQuery: FilterQuery<IDepartmentDoc> = {
    _id: { $in: mappedDepartmentIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  // const employeesToUpdate = (
  //   await Department.aggregate([
  //     {
  //       $match: {
  //         $in: mappedDepartmentIds,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'employees',
  //         localField: '_id',
  //         foreignField: 'departmentId',
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

  await Department.deleteMany(matchQuery);
};

export const createAdminDepartmentForBusiness = async (
  businessId: mongoose.Types.ObjectId,
  session: ClientSession | null
): Promise<IDepartmentDoc> => {
  const adminPermissions: any = {};
  for (const resource of Object.values(Resource)) {
    adminPermissions[resource] = [Action.ALL];
  }

  if (await Department.isTitleTaken('Admin', businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin department for this business already exists.');

  const department = await createDepartment(
    {
      title: 'Admin',
      permissions: adminPermissions,
      businessId,
    },
    session
  );

  return department;
};
