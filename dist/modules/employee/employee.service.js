"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeesByRole = exports.getEmployeesByFilterQuery = exports.deleteEmployeeById = exports.updateEmployeeById = exports.findEmployeeByEmail = exports.findEmployeeById = exports.queryEmployees = exports.registerEmployee = exports.createEmployee = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const employee_model_1 = __importDefault(require("./employee.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const department_service_1 = require("../department/department.service");
/**
 * Create a employee
 * @param {NewCreatedEmployee} employeeBody
 * @returns {Promise<IEmployeeDoc>}
 */
const createEmployee = async (employeeBody) => {
    if (await employee_model_1.default.isEmailTaken(employeeBody.email))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    const department = await (0, department_service_1.findDepartmentByFilterQuery)({
        businessId: employeeBody.businessId,
        _id: new mongoose_1.default.Types.ObjectId(employeeBody.departmentId),
    });
    if (!department)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Department not found.');
    // employeeBody = { ...employeeBody };
    return employee_model_1.default.create(employeeBody);
};
exports.createEmployee = createEmployee;
/**
 * Register a employee
 * @param {RegisterEmployeePayload} employeeBody
 * @returns {Promise<IEmployeeDoc>}
 */
const registerEmployee = async (employeeBody, session) => {
    if (await employee_model_1.default.isEmailTaken(employeeBody.email))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    const [employee] = await employee_model_1.default.create([Object.assign(Object.assign({}, employeeBody), { role: 'admin' })], { session });
    if (!employee)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong');
    return employee;
};
exports.registerEmployee = registerEmployee;
/**
 * Query for employees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryEmployees = async (filter, options) => {
    const employees = await employee_model_1.default.paginate(filter, options);
    return employees;
};
exports.queryEmployees = queryEmployees;
/**
 * Get employee by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IEmployeeDoc | null>}
 */
const findEmployeeById = async (id) => employee_model_1.default.findById(id);
exports.findEmployeeById = findEmployeeById;
/**
 * Get employee by email
 * @param {string} email
 * @returns {Promise<IEmployeeDoc | null>}
 */
const findEmployeeByEmail = async (email) => employee_model_1.default.findOne({ email });
exports.findEmployeeByEmail = findEmployeeByEmail;
/**
 * Update employee by id
 * @param {mongoose.Types.ObjectId} employeeId
 * @param {UpdateEmployeePayload} updateBody
 * @returns {Promise<IEmployeeDoc | null>}
 */
const updateEmployeeById = async (employeeId, updateBody) => {
    console.log(updateBody);
    const employee = await (0, exports.findEmployeeById)(employeeId);
    if (!employee)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Employee not found');
    if (updateBody.email && (await employee_model_1.default.isEmailTaken(updateBody.email, employeeId)))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    if (updateBody.departmentId) {
        const department = await (0, department_service_1.findDepartmentByFilterQuery)({
            _id: new mongoose_1.default.Types.ObjectId(updateBody.departmentId),
        });
        if (!department)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Department not found.');
    }
    Object.assign(employee, updateBody);
    await employee.save();
    return employee;
};
exports.updateEmployeeById = updateEmployeeById;
/**
 * Delete employee by id
 * @param {mongoose.Types.ObjectId} employeeId
 * @returns {Promise<IEmployeeDoc | null>}
 */
const deleteEmployeeById = async (employeeId) => {
    const employee = await (0, exports.findEmployeeById)(employeeId);
    if (!employee)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Employee not found');
    await employee.deleteOne();
    return employee;
};
exports.deleteEmployeeById = deleteEmployeeById;
const getEmployeesByFilterQuery = async (filterQuery) => employee_model_1.default.aggregate([
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
exports.getEmployeesByFilterQuery = getEmployeesByFilterQuery;
const getEmployeesByRole = async (employee) => {
    let filterQuery = {};
    if (employee.role !== 'super_admin') {
        filterQuery = {
            businessId: employee.business._id,
        };
        if (employee.role !== 'admin') {
            filterQuery = Object.assign(Object.assign({}, filterQuery), { role: { $ne: 'admin' } });
        }
    }
    const employees = await (0, exports.getEmployeesByFilterQuery)(filterQuery);
    return employees;
};
exports.getEmployeesByRole = getEmployeesByRole;
//# sourceMappingURL=employee.service.js.map