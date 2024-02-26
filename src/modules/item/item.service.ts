import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { ICombinationItem, IItemDoc, NewItem, UpdateItem } from './item.interfaces';
import Item from './item.model';
import runInTransaction from '../utils/transactionWrapper';
import splitFromQuery from '../utils/common';

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

export const sanitizeCombinationParams = async (combinationItems: ICombinationItem[]): Promise<ICombinationItem[]> => {
  const combinationItemIds = combinationItems.map((combinationItem: ICombinationItem) => combinationItem._id);
  const dbCombinationItems = await findItemsByFilterQuery({
    _id: {
      $in: combinationItemIds,
    },
  });

  const dbCombinationItemsMap = new Map();
  for (const dbCombinationItem of dbCombinationItems) {
    if (!dbCombinationItemsMap.has(dbCombinationItem._id.toString())) {
      dbCombinationItemsMap.set(dbCombinationItem._id.toString(), dbCombinationItem);
    }
  }

  return combinationItems.map((combinationItem: ICombinationItem) => {
    const correspondingCombinationItem = dbCombinationItemsMap.get(combinationItem._id);
    if (!correspondingCombinationItem) throw new ApiError(httpStatus.NOT_FOUND, 'Raw Item not found.');
    return {
      ...combinationItem,
      price: correspondingCombinationItem.price,
      name: correspondingCombinationItem.name,
    };
  });
};

export const createItem = async (itemBody: NewItem): Promise<IItemDoc> => {
  if (await Item.isNameTaken(itemBody.name, itemBody.businessId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item with the entered name already exists.');
  }

  const copiedItemCreateBody = { ...itemBody };

  let copiedCombinationItems: ICombinationItem[] = [];

  if (copiedItemCreateBody.isCombination) {
    if (!copiedItemCreateBody.combinationItems || copiedItemCreateBody.combinationItems.length <= 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'No combination items provided.');

    copiedCombinationItems = await sanitizeCombinationParams(itemBody.combinationItems);
  }

  copiedItemCreateBody.combinationItems = copiedCombinationItems;

  return Item.create(copiedItemCreateBody);
};

export const updateItemById = async (itemId: mongoose.Types.ObjectId, itemBody: UpdateItem): Promise<IItemDoc | null> => {
  const item = await findItemById(itemId);
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found.');

  if (await Item.isNameTaken(itemBody.name!, itemBody.businessId!, itemId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item with the entered name already exists.');
  if (itemBody.businessId!.toString() !== item.businessId.toString())
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own items.');

  const copiedItemUpdateBody = { ...itemBody };

  if (copiedItemUpdateBody.isCombination) {
    if (!copiedItemUpdateBody.combinationItems || copiedItemUpdateBody.combinationItems.length <= 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'No combination items provided.');

    copiedItemUpdateBody.combinationItems = await sanitizeCombinationParams(itemBody.combinationItems!);
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
          if (itemIds.includes(combinationItem._id.toString())) {
            console.log(parseInt(index, 10));
            dbItem.combinationItems.splice(parseInt(index, 10), 1);
          }
        }
        await dbItem.save({ session });
      })
    );
    await Item.deleteMany(matchQuery).session(session);
  });
};
