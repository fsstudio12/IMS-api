"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemTableListHandler = exports.deleteItemsById = exports.updateItemById = exports.validationForUpdateItemById = exports.createItem = exports.sanitizeItemParams = exports.findItemByIdAndBusinessId = exports.findItemByFilterQuery = exports.findItemById = exports.findItemsByFilterQuery = exports.getItemsByBusinessId = exports.getItemsWithMatchQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const item_model_1 = __importDefault(require("./item.model"));
const transactionWrapper_1 = __importDefault(require("../utils/transactionWrapper"));
const common_1 = require("../utils/common");
const getItemsWithMatchQuery = async (matchQuery) => {
    return item_model_1.default.aggregate([
        {
            $match: matchQuery,
        },
    ]);
};
exports.getItemsWithMatchQuery = getItemsWithMatchQuery;
const getItemsByBusinessId = async (businessId) => (0, exports.getItemsWithMatchQuery)({ businessId });
exports.getItemsByBusinessId = getItemsByBusinessId;
const findItemsByFilterQuery = async (filterQuery) => item_model_1.default.find(filterQuery);
exports.findItemsByFilterQuery = findItemsByFilterQuery;
const findItemById = async (id) => item_model_1.default.findById(id);
exports.findItemById = findItemById;
const findItemByFilterQuery = async (filterQuery) => item_model_1.default.findOne(filterQuery);
exports.findItemByFilterQuery = findItemByFilterQuery;
const findItemByIdAndBusinessId = async (_id, businessId) => {
    return (0, exports.findItemByFilterQuery)({ _id, businessId });
};
exports.findItemByIdAndBusinessId = findItemByIdAndBusinessId;
const sanitizeItemParams = async (items, useInputItemPrice = false, checkIfSellable = false, returnPrice = true) => {
    const itemIds = items.map((item) => item._id);
    const dbItems = await (0, exports.findItemsByFilterQuery)({
        _id: {
            $in: itemIds,
        },
    });
    const dbItemsMap = new Map();
    for (const dbItem of dbItems) {
        if (!dbItemsMap.has((0, common_1.stringifyObjectId)(dbItem._id))) {
            dbItemsMap.set((0, common_1.stringifyObjectId)(dbItem._id), dbItem);
        }
    }
    return items.map((item) => {
        var _a, _b;
        const correspondingItem = dbItemsMap.get((0, common_1.stringifyObjectId)(item._id));
        console.log('🚀 ~ returnitems.map ~ correspondingItem:', correspondingItem);
        if (!correspondingItem)
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Raw Item not found.');
        if (checkIfSellable && !correspondingItem.isSellable)
            throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, `Item ${correspondingItem.name} is not sellable.`);
        let returnItem = Object.assign(Object.assign({}, item), { name: correspondingItem.name });
        if (returnPrice) {
            returnItem = Object.assign(Object.assign({}, returnItem), { price: useInputItemPrice ? (_a = item.price) !== null && _a !== void 0 ? _a : 0 : (_b = correspondingItem.price) !== null && _b !== void 0 ? _b : 0 });
        }
        return returnItem;
    });
};
exports.sanitizeItemParams = sanitizeItemParams;
const validationForCreateItem = async (itemBody) => {
    if (await item_model_1.default.isNameTaken(itemBody.name, itemBody.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Item with the entered name already exists.');
    if ((itemBody.isSellable && !Object.prototype.hasOwnProperty.call(itemBody, 'price')) ||
        (Object.prototype.hasOwnProperty.call(itemBody, 'price') && (itemBody === null || itemBody === void 0 ? void 0 : itemBody.price) != null && itemBody.price < 0))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Item must have price if it is sellable.');
    if (!itemBody.isSellable && itemBody.price)
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Item cannot have price if it is not sellable.');
};
const createItem = async (itemBody) => {
    await validationForCreateItem(itemBody);
    const copiedItemCreateBody = Object.assign({}, itemBody);
    let copiedCombinationItems = [];
    if (copiedItemCreateBody.isCombination) {
        if (!copiedItemCreateBody.combinationItems || copiedItemCreateBody.combinationItems.length <= 0)
            throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'No combination items provided.');
        copiedCombinationItems = await (0, exports.sanitizeItemParams)(itemBody.combinationItems);
    }
    copiedItemCreateBody.combinationItems = copiedCombinationItems;
    return item_model_1.default.create(copiedItemCreateBody);
};
exports.createItem = createItem;
const validationForUpdateItemById = async (itemId, itemBody) => {
    console.log('🚀 ~ itemBody:', itemBody);
    if ((itemBody.isSellable && !Object.prototype.hasOwnProperty.call(itemBody, 'price')) ||
        (Object.prototype.hasOwnProperty.call(itemBody, 'price') && (itemBody === null || itemBody === void 0 ? void 0 : itemBody.price) != null && itemBody.price < 0))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Item must have price if it is sellable.');
    if (!itemBody.isSellable && itemBody.price)
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Item cannot have price if it is not sellable.');
    if (await item_model_1.default.isNameTaken(itemBody.name, itemBody.businessId, itemId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Item with the entered name already exists.');
    const item = await (0, exports.findItemById)(itemId);
    if (!item)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Item not found.');
    if ((0, common_1.stringifyObjectId)(itemBody.businessId) !== (0, common_1.stringifyObjectId)(item.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'You can only update your own items.');
    return item;
};
exports.validationForUpdateItemById = validationForUpdateItemById;
const updateItemById = async (itemId, itemBody) => {
    const item = await (0, exports.validationForUpdateItemById)(itemId, itemBody);
    const copiedItemUpdateBody = Object.assign({}, itemBody);
    if (copiedItemUpdateBody.isCombination) {
        if (!copiedItemUpdateBody.combinationItems || copiedItemUpdateBody.combinationItems.length <= 0)
            throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'No combination items provided.');
        copiedItemUpdateBody.combinationItems = await (0, exports.sanitizeItemParams)(itemBody.combinationItems);
    }
    Object.assign(item, copiedItemUpdateBody);
    await item.save();
    return item;
};
exports.updateItemById = updateItemById;
const deleteItemsById = async (queryItemIds, businessId) => {
    const itemIds = (0, common_1.splitFromQuery)(queryItemIds);
    const mappedItemIds = itemIds.map((itemId) => new mongoose_1.default.Types.ObjectId(itemId));
    const matchQuery = {
        _id: { $in: mappedItemIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    const dbCombinedItems = await (0, exports.findItemsByFilterQuery)({
        'combinationItems._id': {
            $in: mappedItemIds,
        },
    });
    await (0, transactionWrapper_1.default)(async (session) => {
        await Promise.all(dbCombinedItems.map(async (dbItem) => {
            for (const [index, combinationItem] of Object.entries(dbItem.combinationItems)) {
                if (itemIds.includes((0, common_1.stringifyObjectId)(combinationItem._id))) {
                    dbItem.combinationItems.splice(parseInt(index, 10), 1);
                }
            }
            await dbItem.save({ session });
        }));
        await item_model_1.default.deleteMany(matchQuery).session(session);
    });
};
exports.deleteItemsById = deleteItemsById;
const getItemTableListHandler = async (businessId) => {
    return item_model_1.default.aggregate([
        {
            $match: {
                businessId,
            },
        },
        {
            $addFields: {
                foodCost: 123,
                average: 130,
                combination: {
                    $cond: [
                        {
                            $eq: ['$isCombination', true],
                        },
                        {
                            $map: {
                                input: '$combinationItems',
                                as: 'ci',
                                in: '$$ci.name',
                            },
                        },
                        null,
                    ],
                },
            },
        },
        {
            $unwind: {
                path: '$combinationItems',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'items',
                localField: 'combinationItems._id',
                foreignField: '_id',
                as: 'ci',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            isCombination: 1,
                        },
                    },
                ],
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        '$$ROOT',
                        {
                            combinationItems: {
                                $cond: [
                                    '$ci._id',
                                    {
                                        _id: '$combinationItems._id',
                                        name: '$combinationItems.name',
                                        quantity: '$combinationItems.quantity',
                                        quantityMetric: '$combinationItems.quantityMetric',
                                        // isCombination: { $first: '$ci.isCombination' },
                                    },
                                    '$$REMOVE',
                                ],
                            },
                        },
                    ],
                },
            },
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                quantity: { $first: '$quantity' },
                quantityMetric: { $first: '$quantityMetric' },
                combination: { $first: '$combination' },
                foodCost: { $first: '$foodCost' },
                average: { $first: '$average' },
                isSellable: { $first: '$isSellable' },
                isCombination: { $first: '$isCombination' },
                price: { $first: '$price' },
                combinationItems: {
                    $push: {
                        $cond: ['$combinationItems._id', '$combinationItems', '$$REMOVE'],
                    },
                },
                createdAt: { $first: '$createdAt' },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                createdAt: 0,
            },
        },
    ]);
};
exports.getItemTableListHandler = getItemTableListHandler;
//# sourceMappingURL=item.service.js.map