import httpStatus from 'http-status';
import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import Employee from './employee.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import {
  IEmployeeDoc,
  RegisterEmployeePayload,
  EmployeePayloadWithFullInfo,
  UpdateEmployeePayload,
  IEmployeeForAuth,
} from './employee.interfaces';
import { findDepartmentByFilterQuery } from '../department/department.service';

/**
 * Create a employee
 * @param {NewCreatedEmployee} employeeBody
 * @returns {Promise<IEmployeeDoc>}
 */
export const createEmployee = async (employeeBody: EmployeePayloadWithFullInfo): Promise<IEmployeeDoc> => {
  if (await Employee.isEmailTaken(employeeBody.email)) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  const department = await findDepartmentByFilterQuery({
    businessId: employeeBody.businessId,
    _id: new mongoose.Types.ObjectId(employeeBody.departmentId),
  });
  if (!department) throw new ApiError(httpStatus.NOT_FOUND, 'Department not found.');

  // employeeBody = { ...employeeBody };

  return Employee.create(employeeBody);
};

/**
 * Register a employee
 * @param {RegisterEmployeePayload} employeeBody
 * @returns {Promise<IEmployeeDoc>}
 */
export const registerEmployee = async (
  employeeBody: RegisterEmployeePayload,
  session: ClientSession
): Promise<IEmployeeDoc> => {
  if (await Employee.isEmailTaken(employeeBody.email)) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  const [employee] = await Employee.create([{ ...employeeBody, role: 'admin' }], { session });
  if (!employee) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
  return employee;
};

/**
 * Query for employees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryEmployees = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const employees = await Employee.paginate(filter, options);
  return employees;
};

/**
 * Get employee by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IEmployeeDoc | null>}
 */
export const findEmployeeById = async (id: mongoose.Types.ObjectId): Promise<IEmployeeDoc | null> => Employee.findById(id);

/**
 * Get employee by email
 * @param {string} email
 * @returns {Promise<IEmployeeDoc | null>}
 */
export const findEmployeeByEmail = async (email: string): Promise<IEmployeeDoc | null> => Employee.findOne({ email });

/**
 * Update employee by id
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {UpdateEmployeePayload} updateBody
 * @returns {Promise<IEmployeeDoc | null>}
 */
export const updateEmployeeById = async (
  employeeId: mongoose.Types.ObjectId,
  updateBody: UpdateEmployeePayload
): Promise<IEmployeeDoc | null> => {
  console.log(updateBody);
  const employee = await findEmployeeById(employeeId);
  if (!employee) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');

  if (updateBody.email && (await Employee.isEmailTaken(updateBody.email, employeeId)))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  if (updateBody.departmentId) {
    const department = await findDepartmentByFilterQuery({
      _id: new mongoose.Types.ObjectId(updateBody.departmentId),
    });
    if (!department) throw new ApiError(httpStatus.NOT_FOUND, 'Department not found.');
  }

  Object.assign(employee, updateBody);
  await employee.save();
  return employee;
};

/**
 * Delete employee by id
 * @param {mongoose.Types.ObjectId} employeeId
 * @returns {Promise<IEmployeeDoc | null>}
 */
export const deleteEmployeeById = async (employeeId: mongoose.Types.ObjectId): Promise<IEmployeeDoc | null> => {
  const employee = await findEmployeeById(employeeId);
  if (!employee) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');

  await employee.deleteOne();
  return employee;
};

export const getEmployeesByFilterQuery = async (filterQuery: FilterQuery<IEmployeeDoc>): Promise<IEmployeeDoc[]> =>
  Employee.aggregate([
    {
      $match: filterQuery,
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department',
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              permissions: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'businesses',
        localField: 'businessId',
        foreignField: '_id',
        as: 'business',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        role: 1,
        department: { $first: '$department' },
        business: { $first: '$business' },
        isEmailVerified: 1,
        isVerified: 1,
        isBanned: 1,
        createdAt: 1,
      },
    },
  ]);

export const getEmployeesByRole = async (employee: IEmployeeForAuth): Promise<IEmployeeDoc[]> => {
  let filterQuery: FilterQuery<IEmployeeDoc> = {};
  if (employee.role !== 'super_admin') {
    filterQuery = {
      businessId: employee.business._id,
    };
    if (employee.role !== 'admin') {
      filterQuery = { ...filterQuery, role: { $ne: 'admin' } };
    }
  }

  const employees = await getEmployeesByFilterQuery(filterQuery);
  return employees;
};
