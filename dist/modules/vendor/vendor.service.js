"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendorById = exports.updateVendorById = exports.createVendor = exports.findVendorByFilterQuery = exports.findVendorById = exports.findVendorsByFilterQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const vendor_model_1 = __importDefault(require("./vendor.model"));
const errors_1 = require("../errors");
const common_1 = require("../utils/common");
const findVendorsByFilterQuery = async (filterQuery) => vendor_model_1.default.find(filterQuery);
exports.findVendorsByFilterQuery = findVendorsByFilterQuery;
const findVendorById = async (vendorId) => vendor_model_1.default.findById(vendorId);
exports.findVendorById = findVendorById;
const findVendorByFilterQuery = async (filterQuery) => vendor_model_1.default.findOne(filterQuery);
exports.findVendorByFilterQuery = findVendorByFilterQuery;
const createVendor = async (vendorBody) => {
    if (await vendor_model_1.default.isNameTaken(vendorBody.name, vendorBody.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Vendor with the entered name already exists.');
    return vendor_model_1.default.create(vendorBody);
};
exports.createVendor = createVendor;
const updateVendorById = async (vendorId, vendorBody) => {
    const vendor = await (0, exports.findVendorById)(vendorId);
    if (!vendor)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Vendor not found.');
    if (await vendor_model_1.default.isNameTaken(vendorBody.name, vendorBody.businessId, vendorId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Vendor with the entered name already exists.');
    if ((0, common_1.stringifyObjectId)(vendorBody.businessId) !== (0, common_1.stringifyObjectId)(vendor.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'You can only update your own vendor.');
    Object.assign(vendor, vendorBody);
    await vendor.save();
    return vendor;
};
exports.updateVendorById = updateVendorById;
const deleteVendorById = async (queryVendorIds, businessId) => {
    const vendorIds = (0, common_1.splitFromQuery)(queryVendorIds).map((vendorId) => new mongoose_1.default.Types.ObjectId(vendorId));
    const matchQuery = {
        _id: { $in: vendorIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    await vendor_model_1.default.deleteMany(matchQuery);
};
exports.deleteVendorById = deleteVendorById;
//# sourceMappingURL=vendor.service.js.map