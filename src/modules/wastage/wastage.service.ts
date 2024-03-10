import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';

import { ApiError } from '../errors';
import { IWastageDoc, NewWastage, UpdateWastage } from './wastage.interfaces';
import Wastage from './wastage.model';
import { common } from '../utils';
import { sanitizeItemParams } from '../item/item.service';
import { ICombinationItem } from '../item/item.interfaces';
import { getAddRemoveEditArrays, parseToInteger, stringifyObjectId } from '../utils/common';

export const getWastagesWithMatchQuery = (matchQuery: FilterQuery<IWastageDoc>): Promise<IWastageDoc[]> => {
  return Wastage.aggregate([
    {
      $match: matchQuery,
    },
  ]);
};

export const getWastagesByBusinessId = (businessId: mongoose.Types.ObjectId): Promise<IWastageDoc[]> =>
  getWastagesWithMatchQuery({ businessId });

export const findWastagesByFilterQuery = (filterQuery: FilterQuery<IWastageDoc>): Promise<IWastageDoc[]> =>
  Wastage.find(filterQuery);

export const findWastageById = (wastageId: mongoose.Types.ObjectId): Promise<IWastageDoc | null> =>
  Wastage.findById(wastageId);

export const findWastageByFilterQuery = (filterQuery: FilterQuery<IWastageDoc>): Promise<IWastageDoc | null> =>
  Wastage.findOne(filterQuery);

export const createWastage = async (createWastageBody: NewWastage) => {
  const items = await sanitizeItemParams(createWastageBody.items, false, false, true);
  const copiedWastageBody = { ...createWastageBody };
  copiedWastageBody.items = items;

  return Wastage.create(copiedWastageBody);
};

export const getUpdatedItemsForWastage = (
  existingItems: ICombinationItem[],
  newItems: ICombinationItem[]
): ICombinationItem[] => {
  const {
    addEntities: addItems,
    removeEntities: removeItems,
    editEntities: editItems,
  } = getAddRemoveEditArrays(newItems, existingItems);

  for (const removeItem of removeItems) {
    for (const [index, value] of Object.entries(existingItems)) {
      if (stringifyObjectId(removeItem._id) === stringifyObjectId(value._id)) {
        existingItems.splice(parseToInteger(index), 1);
        // update inventory amount of removed items
      }
    }
  }

  for (const editItem of editItems) {
    for (const checkPaymentForParams of newItems) {
      if (stringifyObjectId(editItem._id) === stringifyObjectId(checkPaymentForParams._id)) {
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

export const updateWastageById = async (wastageId: mongoose.Types.ObjectId, updateWastageBody: UpdateWastage) => {
  const wastage = await findWastageById(wastageId);
  if (!wastage) throw new ApiError(httpStatus.NOT_FOUND, 'Wastage not found.');

  const updatedItems = getUpdatedItemsForWastage(wastage.items, updateWastageBody.items);

  Object.assign(wastage, { ...updateWastageBody, items: updatedItems });
  await wastage.save();

  return wastage;
};

export const deleteWastageById = async (queryWastageIds: string, businessId?: mongoose.Types.ObjectId) => {
  const wastageIds = common
    .splitFromQuery(queryWastageIds)
    .map((wastageId: string) => new mongoose.Types.ObjectId(wastageId));

  const matchQuery: FilterQuery<IWastageDoc> = {
    _id: { $in: wastageIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  // const wastages = await findWastagesByFilterQuery(matchQuery);
  // // update inventory

  await Wastage.deleteMany(matchQuery);
};

export const getWastagesByDate = (businessId: mongoose.Types.ObjectId) => {
  return Wastage.aggregate([
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

export const getWastagesByItem = async (businessId: mongoose.Types.ObjectId) => {
  return Wastage.aggregate([
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
