"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFromUrl = exports.deepCopy = exports.getOrderString = exports.getAddRemoveEditArrays = exports.findIndexOfObjectFromArrayByField = exports.mapFromArrayByField = exports.findObjectFromArrayByField = exports.getTotalOfArrayByField = exports.sortArrayByDate = exports.setTwoDecimalPlaces = exports.splitFromQuery = exports.stringifyObjectId = exports.parseToInteger = exports.parseToString = void 0;
/* eslint-disable-next-line import/no-extraneous-dependencies */
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../config/enums");
const errors_1 = require("../errors");
const parseToString = (value) => value.toString();
exports.parseToString = parseToString;
const parseToInteger = (value) => parseInt(value, 10);
exports.parseToInteger = parseToInteger;
const stringifyObjectId = (_id) => _id.toString();
exports.stringifyObjectId = stringifyObjectId;
const splitFromQuery = (queryParams) => queryParams.split(',');
exports.splitFromQuery = splitFromQuery;
const setTwoDecimalPlaces = (amount) => parseFloat(amount.toFixed(2));
exports.setTwoDecimalPlaces = setTwoDecimalPlaces;
const sortArrayByDate = (arrayToSort, dateField, sortType = enums_1.SortType.DESC) => arrayToSort.sort((a, b) => sortType === enums_1.SortType.DESC
    ? new Date(b[dateField]) - new Date(a[dateField])
    : new Date(a[dateField]) - new Date(b[dateField]));
exports.sortArrayByDate = sortArrayByDate;
const getTotalOfArrayByField = (array, sumField) => array.reduce((total, object) => (0, exports.setTwoDecimalPlaces)(total + object[sumField]), 0);
exports.getTotalOfArrayByField = getTotalOfArrayByField;
const findObjectFromArrayByField = (array, compareValue, findField) => {
    if (typeof compareValue === 'string' || typeof compareValue === 'number') {
        return array.find((object) => object[findField] === compareValue) || null;
    }
    if (compareValue instanceof mongoose_1.default.Types.ObjectId) {
        return (array.find((object) => (0, exports.stringifyObjectId)(object[findField]) === (0, exports.stringifyObjectId)(compareValue)) || null);
    }
    return null;
};
exports.findObjectFromArrayByField = findObjectFromArrayByField;
const mapFromArrayByField = (array, mapField) => array.map((object) => object[mapField]);
exports.mapFromArrayByField = mapFromArrayByField;
const findIndexOfObjectFromArrayByField = (array, compareValue, findField) => {
    if (typeof compareValue === 'string' || typeof compareValue === 'number') {
        return array.findIndex((object) => object[findField] === compareValue);
    }
    if (compareValue instanceof mongoose_1.default.Types.ObjectId) {
        return array.findIndex((object) => (0, exports.stringifyObjectId)(object[findField]) === (0, exports.stringifyObjectId)(compareValue));
    }
    return -1;
};
exports.findIndexOfObjectFromArrayByField = findIndexOfObjectFromArrayByField;
const getDifference = (firstArray, secondArray) => firstArray.filter((firstArrayObject) => !secondArray.some((secondArrayObject) => {
    if (!firstArrayObject._id || !secondArrayObject._id) {
        return !firstArrayObject._id && !secondArrayObject._id;
    }
    return (0, exports.stringifyObjectId)(firstArrayObject._id) === (0, exports.stringifyObjectId)(secondArrayObject._id);
}));
const getAddRemoveEditArrays = (newArray, oldArray) => {
    const addEntities = getDifference(newArray, oldArray);
    const removeEntities = getDifference(oldArray, newArray);
    const editEntities = getDifference(oldArray, [...addEntities, ...removeEntities]);
    return {
        addEntities,
        removeEntities,
        editEntities,
    };
};
exports.getAddRemoveEditArrays = getAddRemoveEditArrays;
const getOrderString = (number) => {
    if (number < 1)
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Invalid input.');
    const lastDigit = number % 10;
    if (number === 1)
        return '1st';
    if (number === 2)
        return '2nd';
    if (number === 3)
        return '3rd';
    let suffix;
    if (number > 10 && number < 20) {
        suffix = 'th';
    }
    else if (lastDigit === 1) {
        suffix = 'st';
    }
    else if (lastDigit === 2) {
        suffix = 'nd';
    }
    else if (lastDigit === 3) {
        suffix = 'rd';
    }
    else {
        suffix = 'th';
    }
    return `${number}${suffix}`;
};
exports.getOrderString = getOrderString;
const deepCopy = (dataToCopy) => JSON.parse(JSON.stringify(dataToCopy));
exports.deepCopy = deepCopy;
const fetchFromUrl = async (url) => {
    try {
        const response = await (0, axios_1.default)(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching:', error);
        throw error;
    }
};
exports.fetchFromUrl = fetchFromUrl;
// getPeriodAgo(
// unit:number
// period: moment.unitOfTime.DurationConstructor
// )
// moment().local().subtract(unit, period)
// getPeriodAgo('hours', parsePeriodToHours(relative||defaultSth))
//# sourceMappingURL=common.js.map