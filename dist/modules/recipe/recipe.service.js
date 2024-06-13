"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipeTableListHandler = exports.deleteRecipesById = exports.updateRecipeById = exports.createRecipe = exports.findRecipeByIdAndBusinessId = exports.findRecipeByFilterQuery = exports.findRecipeById = exports.findRecipesByFilterQuery = exports.getRecipesByBusinessId = exports.getRecipesWithMatchQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const recipe_model_1 = __importDefault(require("./recipe.model"));
const transactionWrapper_1 = __importDefault(require("../utils/transactionWrapper"));
const item_service_1 = require("../item/item.service");
const common_1 = require("../utils/common");
const getRecipesWithMatchQuery = async (matchQuery) => {
    return recipe_model_1.default.aggregate([
        {
            $match: matchQuery,
        },
    ]);
};
exports.getRecipesWithMatchQuery = getRecipesWithMatchQuery;
const getRecipesByBusinessId = async (businessId) => {
    return (0, exports.getRecipesWithMatchQuery)({ businessId });
};
exports.getRecipesByBusinessId = getRecipesByBusinessId;
const findRecipesByFilterQuery = async (filterQuery) => recipe_model_1.default.find(filterQuery);
exports.findRecipesByFilterQuery = findRecipesByFilterQuery;
const findRecipeById = async (id) => recipe_model_1.default.findById(id);
exports.findRecipeById = findRecipeById;
const findRecipeByFilterQuery = async (filterQuery) => recipe_model_1.default.findOne(filterQuery);
exports.findRecipeByFilterQuery = findRecipeByFilterQuery;
const findRecipeByIdAndBusinessId = async (_id, businessId) => {
    return (0, exports.findRecipeByFilterQuery)({ _id, businessId });
};
exports.findRecipeByIdAndBusinessId = findRecipeByIdAndBusinessId;
const createRecipe = async (recipeBody) => {
    if (await recipe_model_1.default.isNameTaken(recipeBody.name, recipeBody.businessId)) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Recipe with the entered name already exists.');
    }
    const copiedRecipeCreateBody = Object.assign({}, recipeBody);
    copiedRecipeCreateBody.combinationItems = await (0, item_service_1.sanitizeItemParams)(recipeBody.combinationItems);
    return recipe_model_1.default.create(copiedRecipeCreateBody);
};
exports.createRecipe = createRecipe;
const updateRecipeById = async (recipeId, updateBody) => {
    const recipe = await (0, exports.findRecipeById)(recipeId);
    if (!recipe)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Recipe not found.');
    if (await recipe_model_1.default.isNameTaken(updateBody.name, updateBody.businessId, recipeId))
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Recipe with the entered name already exists.');
    if ((0, common_1.stringifyObjectId)(updateBody.businessId) !== (0, common_1.stringifyObjectId)(recipe.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'You can only update your own recipes.');
    const copiedRecipeUpdateBody = Object.assign({}, updateBody);
    copiedRecipeUpdateBody.combinationItems = await (0, item_service_1.sanitizeItemParams)(updateBody.combinationItems);
    Object.assign(recipe, copiedRecipeUpdateBody);
    await recipe.save();
    return recipe;
};
exports.updateRecipeById = updateRecipeById;
const deleteRecipesById = async (queryRecipeIds, businessId) => {
    const recipeIds = (0, common_1.splitFromQuery)(queryRecipeIds);
    const mappedRecipeIds = recipeIds.map((recipeId) => {
        return new mongoose_1.default.Types.ObjectId(recipeId);
    });
    const matchQuery = {
        _id: { $in: mappedRecipeIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    const updateRecipes = await (0, exports.findRecipesByFilterQuery)({
        'combinationItems._id': {
            $in: mappedRecipeIds,
        },
    });
    await (0, transactionWrapper_1.default)(async (session) => {
        await Promise.all(updateRecipes.map(async (dbRecipe) => {
            for (const [index, combinationItem] of Object.entries(dbRecipe.combinationItems)) {
                if (recipeIds.includes((0, common_1.stringifyObjectId)(combinationItem._id))) {
                    dbRecipe.combinationItems.splice(parseInt(index, 10), 1);
                }
            }
            await dbRecipe.save({ session });
        }));
        await recipe_model_1.default.deleteMany(matchQuery).session(session);
    });
};
exports.deleteRecipesById = deleteRecipesById;
const getRecipeTableListHandler = async (businessId) => {
    return recipe_model_1.default.aggregate([
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
                price: { $first: '$price' },
                foodCost: { $first: '$foodCost' },
                average: { $first: '$average' },
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
exports.getRecipeTableListHandler = getRecipeTableListHandler;
//# sourceMappingURL=recipe.service.js.map