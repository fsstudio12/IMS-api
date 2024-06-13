"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUtilitiesById = exports.updateUtilityById = exports.createUtility = exports.findUtilityByIdAndBusinessId = exports.findUtilityByFilterQuery = exports.findUtilityById = exports.findUtilitiesByFilterQuery = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const utility_model_1 = __importDefault(require("./utility.model"));
const errors_1 = require("../errors");
const common_1 = require("../utils/common");
const findUtilitiesByFilterQuery = async (filterQuery) => utility_model_1.default.find(filterQuery);
exports.findUtilitiesByFilterQuery = findUtilitiesByFilterQuery;
const findUtilityById = async (id) => utility_model_1.default.findById(id);
exports.findUtilityById = findUtilityById;
const findUtilityByFilterQuery = async (filterQuery) => utility_model_1.default.findOne(filterQuery);
exports.findUtilityByFilterQuery = findUtilityByFilterQuery;
const findUtilityByIdAndBusinessId = async (_id, businessId) => {
    return (0, exports.findUtilityByFilterQuery)({ _id, businessId });
};
exports.findUtilityByIdAndBusinessId = findUtilityByIdAndBusinessId;
const createUtility = async (utilityBody) => {
    const utility = await utility_model_1.default.create(utilityBody);
    return utility;
};
exports.createUtility = createUtility;
const updateUtilityById = async (utilityId, utilityBody) => {
    const utility = await (0, exports.findUtilityById)(utilityId);
    if (!utility)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Utility not found.');
    Object.assign(utility, utilityBody);
    await utility.save();
    return utility;
};
exports.updateUtilityById = updateUtilityById;
const deleteUtilitiesById = async (queryUtilityIds, businessId) => {
    const utilityIds = (0, common_1.splitFromQuery)(queryUtilityIds);
    const mappedUtilityIds = utilityIds.map((utilityId) => new mongoose_1.default.Types.ObjectId(utilityId));
    const matchQuery = {
        _id: { $in: mappedUtilityIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    await utility_model_1.default.deleteMany(matchQuery);
};
exports.deleteUtilitiesById = deleteUtilitiesById;
//# sourceMappingURL=utility.service.js.map