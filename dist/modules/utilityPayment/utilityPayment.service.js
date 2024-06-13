"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUtilityPaymentsById = exports.updateUtilityPaymentById = exports.createUtilityPayment = exports.validateUtilities = exports.getUtilityPaymentsByFilterQuery = exports.findUtilityPaymentByIdAndBusinessId = exports.findUtilityPaymentByFilterQuery = exports.findUtilityPaymentById = exports.findUtilityPaymentsByFilterQuery = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../config/enums");
const utilityPayment_model_1 = __importDefault(require("./utilityPayment.model"));
const errors_1 = require("../errors");
const common_1 = require("../utils/common");
const utility_service_1 = require("../utility/utility.service");
const findUtilityPaymentsByFilterQuery = async (filterQuery) => utilityPayment_model_1.default.find(filterQuery);
exports.findUtilityPaymentsByFilterQuery = findUtilityPaymentsByFilterQuery;
const findUtilityPaymentById = async (id) => utilityPayment_model_1.default.findById(id);
exports.findUtilityPaymentById = findUtilityPaymentById;
const findUtilityPaymentByFilterQuery = async (filterQuery) => utilityPayment_model_1.default.findOne(filterQuery);
exports.findUtilityPaymentByFilterQuery = findUtilityPaymentByFilterQuery;
const findUtilityPaymentByIdAndBusinessId = async (_id, businessId) => {
    return (0, exports.findUtilityPaymentByFilterQuery)({ _id, businessId });
};
exports.findUtilityPaymentByIdAndBusinessId = findUtilityPaymentByIdAndBusinessId;
const getUtilityPaymentsByFilterQuery = async (filterQuery) => utilityPayment_model_1.default.aggregate([
    {
        $match: filterQuery,
    },
    {
        $project: {
            title: 1,
            date: 1,
            timeline: {
                from: '$from',
                to: '$to',
            },
            utilities: 1,
        },
    },
]);
exports.getUtilityPaymentsByFilterQuery = getUtilityPaymentsByFilterQuery;
const validateUtilities = async (utilities) => {
    const validationPromises = utilities.map(async (utility) => {
        const checkUtility = await (0, utility_service_1.findUtilityById)(utility._id);
        if (!checkUtility)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Selected utility not found.');
        const updatedUtility = {
            _id: checkUtility._id,
            title: checkUtility.title,
            payments: utility.payments.map((payment) => {
                var _a, _b;
                return ({
                    _id: payment._id ? new mongoose_1.default.Types.ObjectId(payment._id) : new mongoose_1.default.Types.ObjectId(),
                    date: (_a = payment.date) !== null && _a !== void 0 ? _a : new Date(),
                    amount: payment.amount,
                    method: (_b = payment === null || payment === void 0 ? void 0 : payment.method) !== null && _b !== void 0 ? _b : enums_1.PaymentMethod.CASH,
                });
            }),
        };
        return updatedUtility;
    });
    const validatedUtilities = await Promise.all(validationPromises);
    return validatedUtilities;
};
exports.validateUtilities = validateUtilities;
const createUtilityPayment = async (utilityPaymentBody) => {
    const validatedUtilities = await (0, exports.validateUtilities)(utilityPaymentBody.utilities);
    const utilityPayment = await utilityPayment_model_1.default.create(Object.assign(Object.assign({}, utilityPaymentBody), { utilities: validatedUtilities }));
    return utilityPayment;
};
exports.createUtilityPayment = createUtilityPayment;
const updateUtilityPaymentById = async (utilityPaymentId, utilityPaymentBody) => {
    const utilityPayment = await (0, exports.findUtilityPaymentById)(utilityPaymentId);
    if (!utilityPayment)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'UtilityPayment not found.');
    const validatedUtilities = await (0, exports.validateUtilities)(utilityPaymentBody.utilities);
    Object.assign(utilityPayment, Object.assign(Object.assign({}, utilityPaymentBody), { utilities: validatedUtilities }));
    await utilityPayment.save();
    return utilityPayment;
};
exports.updateUtilityPaymentById = updateUtilityPaymentById;
const deleteUtilityPaymentsById = async (queryUtilityPaymentIds, businessId) => {
    const utilityPaymentIds = (0, common_1.splitFromQuery)(queryUtilityPaymentIds);
    const mappedUtilityPaymentIds = utilityPaymentIds.map((utilityPaymentId) => new mongoose_1.default.Types.ObjectId(utilityPaymentId));
    const matchQuery = {
        _id: { $in: mappedUtilityPaymentIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    await utilityPayment_model_1.default.deleteMany(matchQuery);
};
exports.deleteUtilityPaymentsById = deleteUtilityPaymentsById;
//# sourceMappingURL=utilityPayment.service.js.map