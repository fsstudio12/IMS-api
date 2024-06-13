"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWastagesByItem = exports.getWastagesByDate = exports.deleteWastageById = exports.updateWastageById = exports.getUpdatedItemsForWastage = exports.createWastage = exports.findWastageByFilterQuery = exports.findWastageById = exports.findWastagesByFilterQuery = exports.getWastagesByBusinessId = exports.getWastagesWithMatchQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const wastage_model_1 = __importDefault(require("./wastage.model"));
const utils_1 = require("../utils");
const item_service_1 = require("../item/item.service");
const common_1 = require("../utils/common");
const getWastagesWithMatchQuery = (matchQuery) => {
    return wastage_model_1.default.aggregate([
        {
            $match: matchQuery,
        },
    ]);
};
exports.getWastagesWithMatchQuery = getWastagesWithMatchQuery;
const getWastagesByBusinessId = (businessId) => (0, exports.getWastagesWithMatchQuery)({ businessId });
exports.getWastagesByBusinessId = getWastagesByBusinessId;
const findWastagesByFilterQuery = (filterQuery) => wastage_model_1.default.find(filterQuery);
exports.findWastagesByFilterQuery = findWastagesByFilterQuery;
const findWastageById = (wastageId) => wastage_model_1.default.findById(wastageId);
exports.findWastageById = findWastageById;
const findWastageByFilterQuery = (filterQuery) => wastage_model_1.default.findOne(filterQuery);
exports.findWastageByFilterQuery = findWastageByFilterQuery;
const createWastage = async (createWastageBody) => {
    const items = await (0, item_service_1.sanitizeItemParams)(createWastageBody.items, false, false, true);
    const copiedWastageBody = Object.assign({}, createWastageBody);
    copiedWastageBody.items = items;
    return wastage_model_1.default.create(copiedWastageBody);
};
exports.createWastage = createWastage;
const getUpdatedItemsForWastage = (existingItems, newItems) => {
    const { addEntities: addItems, removeEntities: removeItems, editEntities: editItems, } = (0, common_1.getAddRemoveEditArrays)(newItems, existingItems);
    for (const removeItem of removeItems) {
        for (const [index, value] of Object.entries(existingItems)) {
            if ((0, common_1.stringifyObjectId)(removeItem._id) === (0, common_1.stringifyObjectId)(value._id)) {
                existingItems.splice((0, common_1.parseToInteger)(index), 1);
                // update inventory amount of removed items
            }
        }
    }
    for (const editItem of editItems) {
        for (const checkPaymentForParams of newItems) {
            if ((0, common_1.stringifyObjectId)(editItem._id) === (0, common_1.stringifyObjectId)(checkPaymentForParams._id)) {
                Object.assign(editItem, checkPaymentForParams);
                // update inventory amount of edit items accordingly
            }
        }
    }
    for (const addItem of addItems) {
        console.log(addItem);
        // update inventory amount of add items
    }
    return [...editItems, ...addItems];
    // Remove items from the purchase and update inventory after completing the inventory logic
    // await Promise.all(
    //   removeItems.map(async (removeItem) => {
    //     await removeItemFromPurchase(removeItem._id);
    //     await updateInventory(removeItem, 'remove');
    //   })
    // );
    // // Edit items in the purchase and update inventory
    // await Promise.all(
    //   editItems.map(async (editItem) => {
    //     await updateItemInPurchase(editItem._id, editItem);
    //     await updateInventory(editItem, 'edit');
    //   })
    // );
    // // Add items to the purchase and update inventory
    // await Promise.all(
    //   addItems.map(async (addItem) => {
    //     await addItemToPurchase(addItem);
    //     await updateInventory(addItem, 'add');
    //   })
    // );
    // // Return the updated items
    // return [...editItems, ...addItems];
};
exports.getUpdatedItemsForWastage = getUpdatedItemsForWastage;
const updateWastageById = async (wastageId, updateWastageBody) => {
    const wastage = await (0, exports.findWastageById)(wastageId);
    if (!wastage)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Wastage not found.');
    const updatedItems = (0, exports.getUpdatedItemsForWastage)(wastage.items, updateWastageBody.items);
    Object.assign(wastage, Object.assign(Object.assign({}, updateWastageBody), { items: updatedItems }));
    await wastage.save();
    return wastage;
};
exports.updateWastageById = updateWastageById;
const deleteWastageById = async (queryWastageIds, businessId) => {
    const wastageIds = utils_1.common
        .splitFromQuery(queryWastageIds)
        .map((wastageId) => new mongoose_1.default.Types.ObjectId(wastageId));
    const matchQuery = {
        _id: { $in: wastageIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    // const wastages = await findWastagesByFilterQuery(matchQuery);
    // // update inventory
    await wastage_model_1.default.deleteMany(matchQuery);
};
exports.deleteWastageById = deleteWastageById;
const getWastagesByDate = (businessId) => {
    return wastage_model_1.default.aggregate([
        {
            $match: { businessId },
        },
        {
            $unwind: '$items',
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                items: { $push: '$items' },
                itemNames: { $addToSet: '$items.name' },
                amount: {
                    $sum: {
                        $gt: ['$items.price', 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                items: {
                    $map: {
                        input: '$items',
                        as: 'item',
                        in: {
                            _id: '$$item._id',
                            name: '$$item.name',
                            quantity: '$$item.quantity',
                            quantityMetric: '$$item.quantityMetric',
                            price: {
                                $gt: ['$$item.price', 0],
                            },
                        },
                    },
                },
                itemNames: 1,
                amount: 1,
            },
        },
        {
            $sort: {
                date: 1,
            },
        },
    ]);
};
exports.getWastagesByDate = getWastagesByDate;
const getWastagesByItem = async (businessId) => {
    return wastage_model_1.default.aggregate([
        {
            $match: { businessId },
        },
        {
            $unwind: '$items',
        },
        {
            $project: {
                itemInfo: {
                    _id: '$items._id',
                    name: '$items.name',
                },
                dateAndQuantityInfo: {
                    date: '$date',
                    quantity: '$items.quantity',
                    quantityMetric: '$items.quantityMetric',
                    price: {
                        $gt: ['$items.price', 0],
                    },
                },
            },
        },
        {
            $group: {
                _id: '$itemInfo',
                quantityInfo: { $push: '$dateAndQuantityInfo' },
                amount: { $sum: '$dateAndQuantityInfo.price' },
            },
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                dateAndQuantityInfo: 1,
                amount: 1,
            },
        },
        {
            $sort: {
                name: 1,
            },
        },
    ]);
};
exports.getWastagesByItem = getWastagesByItem;
//# sourceMappingURL=wastage.service.js.map