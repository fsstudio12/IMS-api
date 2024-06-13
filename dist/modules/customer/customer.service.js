"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomersById = exports.updateCustomerById = exports.createCustomer = exports.findCustomerByFilterQuery = exports.findCustomerById = exports.findCustomersByFilterQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const customer_model_1 = __importDefault(require("./customer.model"));
const errors_1 = require("../errors");
const common_1 = require("../utils/common");
const enums_1 = require("../../config/enums");
const s3Operations_1 = require("../utils/s3Operations");
const config_1 = __importDefault(require("../../config/config"));
const fileOperations_1 = require("../utils/fileOperations");
const findCustomersByFilterQuery = async (filterQuery) => customer_model_1.default.find(filterQuery);
exports.findCustomersByFilterQuery = findCustomersByFilterQuery;
const findCustomerById = async (customerId) => customer_model_1.default.findById(customerId);
exports.findCustomerById = findCustomerById;
const findCustomerByFilterQuery = async (filterQuery) => customer_model_1.default.findOne(filterQuery);
exports.findCustomerByFilterQuery = findCustomerByFilterQuery;
const createCustomer = async (customerBody) => {
    if (await customer_model_1.default.isNameTaken(customerBody.name, customerBody.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Customer with the entered name already exists.');
    if (await customer_model_1.default.isPhoneTaken(customerBody.phone, customerBody.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Customer with the entered phone already exists.');
    if (customerBody.type === enums_1.CustomerType.INDIVIDUAL && (customerBody.registrationType || customerBody.registrationNumber))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Customer of Individual type cannot have registration number and type.');
    const sanitizedCustomerBody = Object.assign({}, customerBody);
    if (customerBody.image) {
        const imageUrl = await (0, fileOperations_1.gets3FileUrl)(null, sanitizedCustomerBody.image, config_1.default.aws.customersFolder);
        sanitizedCustomerBody.image = imageUrl;
    }
    sanitizedCustomerBody.registrationType = (customerBody === null || customerBody === void 0 ? void 0 : customerBody.registrationType) ? customerBody === null || customerBody === void 0 ? void 0 : customerBody.registrationType : null;
    return customer_model_1.default.create(sanitizedCustomerBody);
};
exports.createCustomer = createCustomer;
const updateCustomerById = async (customerId, customerBody) => {
    const customer = await (0, exports.findCustomerById)(customerId);
    if (!customer)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Customer not found.');
    if (await customer_model_1.default.isNameTaken(customerBody.name, customerBody.businessId, customerId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Customer with the entered name already exists.');
    if ((0, common_1.stringifyObjectId)(customerBody.businessId) !== (0, common_1.stringifyObjectId)(customer.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'You can only update your own customer.');
    const sanitizedCustomerBody = Object.assign({}, customerBody);
    if (sanitizedCustomerBody.image) {
        sanitizedCustomerBody.image = await (0, fileOperations_1.gets3FileUrl)(customer.image, sanitizedCustomerBody.image, config_1.default.aws.customersFolder);
    }
    sanitizedCustomerBody.registrationType = (customerBody === null || customerBody === void 0 ? void 0 : customerBody.registrationType) ? customerBody === null || customerBody === void 0 ? void 0 : customerBody.registrationType : null;
    Object.assign(customer, sanitizedCustomerBody);
    await customer.save();
    return customer;
};
exports.updateCustomerById = updateCustomerById;
const deleteCustomersById = async (queryCustomerIds, businessId) => {
    const customerIds = (0, common_1.splitFromQuery)(queryCustomerIds).map((customerId) => new mongoose_1.default.Types.ObjectId(customerId));
    const filterQuery = {
        _id: { $in: customerIds },
    };
    if (businessId) {
        filterQuery.businessId = businessId;
    }
    const customers = await (0, exports.findCustomersByFilterQuery)(filterQuery);
    const imageUrls = (0, common_1.mapFromArrayByField)(customers, 'image');
    const deleteParams = (0, fileOperations_1.getMultipleFileDeleteParams)(imageUrls);
    await (0, s3Operations_1.deleteObjectsFromBucket)(deleteParams);
    await customer_model_1.default.deleteMany(filterQuery);
};
exports.deleteCustomersById = deleteCustomersById;
//# sourceMappingURL=customer.service.js.map