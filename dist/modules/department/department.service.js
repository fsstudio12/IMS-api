"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminDepartmentForBusiness = exports.deleteDepartmentsById = exports.updateDepartmentById = exports.createDepartment = exports.findDepartmentByFilterQuery = exports.findDepartmentById = exports.findDepartmentsByFilterQuery = exports.getDepartmentsByBusinessId = exports.getDepartmentsWithMatchQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const department_model_1 = __importDefault(require("./department.model"));
const common_1 = require("../utils/common");
const resources_1 = __importDefault(require("../../config/resources"));
const actions_1 = __importDefault(require("../../config/actions"));
const getDepartmentsWithMatchQuery = async (matchQuery) => {
    return department_model_1.default.aggregate([
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
exports.getDepartmentsWithMatchQuery = getDepartmentsWithMatchQuery;
const getDepartmentsByBusinessId = async (businessId) => (0, exports.getDepartmentsWithMatchQuery)({ businessId });
exports.getDepartmentsByBusinessId = getDepartmentsByBusinessId;
const findDepartmentsByFilterQuery = async (filterQuery) => department_model_1.default.find(filterQuery);
exports.findDepartmentsByFilterQuery = findDepartmentsByFilterQuery;
const findDepartmentById = async (id) => department_model_1.default.findById(id);
exports.findDepartmentById = findDepartmentById;
const findDepartmentByFilterQuery = async (filterQuery) => department_model_1.default.findOne(filterQuery);
exports.findDepartmentByFilterQuery = findDepartmentByFilterQuery;
/**
 * Create a department
 * @param {NewDepartment} createDepartmentBody
 * @returns {Promise<IDepartmentDoc>}
 */
const createDepartment = async (createDepartmentBody, session) => {
    if (await department_model_1.default.isTitleTaken(createDepartmentBody.title, createDepartmentBody.businessId))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Department with the entered title already exists.');
    const options = session ? { session } : undefined;
    const [department] = await department_model_1.default.create([createDepartmentBody], options);
    if (!department)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong.');
    return department;
};
exports.createDepartment = createDepartment;
const updateDepartmentById = async (departmentId, updateDepartmentBody) => {
    const department = await (0, exports.findDepartmentById)(departmentId);
    if (!department)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Department not found.');
    if (await department_model_1.default.isTitleTaken(updateDepartmentBody.title, updateDepartmentBody.businessId, department._id))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Another department with the entered title already exists.');
    Object.assign(department, updateDepartmentBody);
    await department.save();
    return department;
};
exports.updateDepartmentById = updateDepartmentById;
const deleteDepartmentsById = async (queryDepartmentIds, businessId) => {
    const departmentIds = (0, common_1.splitFromQuery)(queryDepartmentIds);
    const mappedDepartmentIds = departmentIds.map((departmentId) => {
        return new mongoose_1.default.Types.ObjectId(departmentId);
    });
    const matchQuery = {
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
    await department_model_1.default.deleteMany(matchQuery);
};
exports.deleteDepartmentsById = deleteDepartmentsById;
const createAdminDepartmentForBusiness = async (businessId, session) => {
    const adminPermissions = {};
    for (const resource of Object.values(resources_1.default)) {
        adminPermissions[resource] = [actions_1.default.ALL];
    }
    if (await department_model_1.default.isTitleTaken('Admin', businessId))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin department for this business already exists.');
    const department = await (0, exports.createDepartment)({
        title: 'Admin',
        permissions: adminPermissions,
        businessId,
    }, session);
    return department;
};
exports.createAdminDepartmentForBusiness = createAdminDepartmentForBusiness;
//# sourceMappingURL=department.service.js.map