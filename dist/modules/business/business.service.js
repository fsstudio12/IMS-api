"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusinessById = exports.updateBusinessById = exports.getBusinessByEmail = exports.getBusinessById = exports.queryBusinesses = exports.createBusiness = void 0;
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const business_model_1 = __importDefault(require("./business.model"));
const employee_1 = require("../employee");
const createBusiness = async (businessBody, session) => {
    if (await business_model_1.default.isNameTaken(businessBody.name))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Business with the entered name already exists.');
    if (await business_model_1.default.isEmailTaken(businessBody.email))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Business with the entered email already exists.');
    const options = session ? { session } : undefined;
    const [business] = await business_model_1.default.create([businessBody], options);
    if (!business)
        throw new errors_1.ApiError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong.');
    return business;
};
exports.createBusiness = createBusiness;
const queryBusinesses = async (filter, options) => {
    const businesses = await business_model_1.default.paginate(filter, options);
    return businesses;
};
exports.queryBusinesses = queryBusinesses;
const getBusinessById = async (id) => business_model_1.default.findById(id);
exports.getBusinessById = getBusinessById;
const getBusinessByEmail = async (email) => business_model_1.default.findOne({ email });
exports.getBusinessByEmail = getBusinessByEmail;
const updateBusinessById = async (businessId, updateBody) => {
    const business = await (0, exports.getBusinessById)(businessId);
    if (!business)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Business not found.');
    if (updateBody.email && (await business_model_1.default.isEmailTaken(updateBody.email, businessId)))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Email already taken.');
    Object.assign(business, updateBody);
    await business.save();
    return business;
};
exports.updateBusinessById = updateBusinessById;
const deleteBusinessById = async (businessId, session) => {
    const options = session ? { session } : undefined;
    const business = await (0, exports.getBusinessById)(businessId);
    if (!business)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Business not found.');
    await Promise.all([
        employee_1.Employee.deleteMany({
            businessId,
        }, options),
        // delete other documents related with the business
        business.deleteOne(options),
    ]);
    return business;
};
exports.deleteBusinessById = deleteBusinessById;
//# sourceMappingURL=business.service.js.map