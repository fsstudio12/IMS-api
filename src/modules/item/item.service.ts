import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { ICombinationItem, IItemDoc, ItemTableList, NewItem, UpdateItem } from './item.interfaces';
import Item from './item.model';
import runInTransaction from '../utils/transactionWrapper';
import { splitFromQuery, stringifyObjectId } from '../utils/common';

export const getItemsWithMatchQuery = async (matchQuery: FilterQuery<IItemDoc>): Promise<IItemDoc[]> => {
  return Item.aggregate([
    {
      $match: matchQuery,
    },
  ]);
};

export const getItemsByBusinessId = async (businessId: mongoose.Types.ObjectId): Promise<IItemDoc[]> =>
  getItemsWithMatchQuery({ businessId });

export const findItemsByFilterQuery = async (filterQuery: FilterQuery<IItemDoc>): Promise<IItemDoc[]> =>
  Item.find(filterQuery);

export const findItemById = async (id: mongoose.Types.ObjectId): Promise<IItemDoc | null> => Item.findById(id);

export const findItemByFilterQuery = async (filterQuery: FilterQuery<IItemDoc>): Promise<IItemDoc | null> =>
  Item.findOne(filterQuery);

export const findItemByIdAndBusinessId = async (
  _id: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
): Promise<IItemDoc | null> => {
  return findItemByFilterQuery({ _id, businessId });
};

export const sanitizeItemParams = async (
  items: ICombinationItem[],
  useInputItemPrice: boolean = false,
  checkIfSellable: boolean = false,
  returnPrice: boolean = true
): Promise<ICombinationItem[]> => {
  const itemIds = items.map((item: ICombinationItem) => item._id);
  const dbItems = await findItemsByFilterQuery({
    _id: {
      $in: itemIds,
    },
  });

  const dbItemsMap: Map<string, IItemDoc> = new Map();
  for (const dbItem of dbItems) {
    if (!dbItemsMap.has(stringifyObjectId(dbItem._id))) {
      dbItemsMap.set(stringifyObjectId(dbItem._id), dbItem);
    }
  }

  return items.map((item: ICombinationItem) => {
    const correspondingItem = dbItemsMap.get(stringifyObjectId(item._id));
    if (!correspondingItem) throw new ApiError(httpStatus.NOT_FOUND, 'Raw Item not found.');

    if (checkIfSellable && !correspondingItem.isSellable)
      throw new ApiError(httpStatus.BAD_REQUEST, `Item ${correspondingItem.name} is not sellable.`);

    let returnItem = {
      ...item,
      name: correspondingItem.name,
    };

    if (returnPrice) {
      returnItem = {
        ...returnItem,
        price: useInputItemPrice ? item.price ?? 0 : correspondingItem.price ?? 0,
      };
    }
    return returnItem;
  });
};

const validationForCreateItem = async (itemBody: NewItem): Promise<void> => {
  if (await Item.isNameTaken(itemBody.name, itemBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item with the entered name already exists.');

  if (
    (itemBody.isSellable && !Object.prototype.hasOwnProperty.call(itemBody, 'price')) ||
    !itemBody.price ||
    itemBody?.price < 0
  )
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item must have price if it is sellable.');

  if (!itemBody.isSellable && itemBody.price)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item cannot have price if it is not sellable.');
};

export const createItem = async (itemBody: NewItem): Promise<IItemDoc> => {
  await validationForCreateItem(itemBody);
  const copiedItemCreateBody = { ...itemBody };

  let copiedCombinationItems: ICombinationItem[] = [];

  if (copiedItemCreateBody.isCombination) {
    if (!copiedItemCreateBody.combinationItems || copiedItemCreateBody.combinationItems.length <= 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'No combination items provided.');

    copiedCombinationItems = await sanitizeItemParams(itemBody.combinationItems);
  }

  copiedItemCreateBody.combinationItems = copiedCombinationItems;

  return Item.create(copiedItemCreateBody);
};

export const validationForUpdateItemById = async (
  itemId: mongoose.Types.ObjectId,
  itemBody: UpdateItem
): Promise<IItemDoc> => {
  if (
    (itemBody.isSellable && !Object.prototype.hasOwnProperty.call(itemBody, 'price')) ||
    !itemBody.price ||
    itemBody?.price < 0
  )
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item must have price if it is sellable.');

  if (!itemBody.isSellable && itemBody.price)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item cannot have price if it is not sellable.');

  if (await Item.isNameTaken(itemBody.name!, itemBody.businessId!, itemId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item with the entered name already exists.');

  const item = await findItemById(itemId);
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found.');

  if (stringifyObjectId(itemBody.businessId!) !== stringifyObjectId(item.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own items.');

  return item;
};

export const updateItemById = async (itemId: mongoose.Types.ObjectId, itemBody: UpdateItem): Promise<IItemDoc | null> => {
  const item = await validationForUpdateItemById(itemId, itemBody);

  const copiedItemUpdateBody = { ...itemBody };

  if (copiedItemUpdateBody.isCombination) {
    if (!copiedItemUpdateBody.combinationItems || copiedItemUpdateBody.combinationItems.length <= 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'No combination items provided.');

    copiedItemUpdateBody.combinationItems = await sanitizeItemParams(itemBody.combinationItems!);
  }

  Object.assign(item, copiedItemUpdateBody);
  await item.save();
  return item;
};

export const deleteItemsById = async (queryItemIds: string, businessId?: mongoose.Types.ObjectId): Promise<void> => {
  const itemIds = splitFromQuery(queryItemIds);
  const mappedItemIds = itemIds.map((itemId: string) => new mongoose.Types.ObjectId(itemId));

  const matchQuery: FilterQuery<IItemDoc> = {
    _id: { $in: mappedItemIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  const dbCombinedItems = await findItemsByFilterQuery({
    'combinationItems._id': {
      $in: mappedItemIds,
    },
  });

  await runInTransaction(async (session: ClientSession) => {
    await Promise.all(
      dbCombinedItems.map(async (dbItem) => {
        for (const [index, combinationItem] of Object.entries(dbItem.combinationItems)) {
          if (itemIds.includes(stringifyObjectId(combinationItem._id))) {
            dbItem.combinationItems.splice(parseInt(index, 10), 1);
          }
        }
        await dbItem.save({ session });
      })
    );
    await Item.deleteMany(matchQuery).session(session);
  });
};

export const getItemTableListHandler = async (businessId: mongoose.Types.ObjectId): Promise<ItemTableList[]> => {
  return Item.aggregate([
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
