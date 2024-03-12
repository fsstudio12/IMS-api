import httpStatus from 'http-status';
import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import Employee from './employee.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedEmployee, UpdateEmployee, IEmployeeDoc, NewRegisteredEmployee } from './employee.interfaces';

/**
 * Create a employee
 * @param {NewCreatedEmployee} employeeBody
 * @returns {Promise<IEmployeeDoc>}
 */
export const createEmployee = async (employeeBody: NewCreatedEmployee): Promise<IEmployeeDoc> => {
  if (await Employee.isEmailTaken(employeeBody.email)) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  return Employee.create(employeeBody);
};

/**
 * Register a employee
 * @param {NewRegisteredEmployee} employeeBody
 * @returns {Promise<IEmployeeDoc>}
 */
export const registerEmployee = async (
  employeeBody: NewRegisteredEmployee,
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
 * @param {UpdateEmployee} updateBody
 * @returns {Promise<IEmployeeDoc | null>}
 */
export const updateEmployeeById = async (
  employeeId: mongoose.Types.ObjectId,
  updateBody: UpdateEmployee
): Promise<IEmployeeDoc | null> => {
  const employee = await findEmployeeById(employeeId);
  if (!employee) throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');

  if (updateBody.email && (await Employee.isEmailTaken(updateBody.email, employeeId)))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

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

export const getEmployeesByRole = async (employee: IEmployeeDoc): Promise<IEmployeeDoc[]> => {
  let filterQuery: FilterQuery<IEmployeeDoc> = {};
  if (employee.role !== 'super_admin') {
    filterQuery = {
      businessId: employee.businessId,
    };
    if (employee.role !== 'admin') {
      filterQuery = { ...filterQuery, role: { $ne: 'admin' } };
    }
  }

  const employees = await getEmployeesByFilterQuery(filterQuery);
  return employees;
};
