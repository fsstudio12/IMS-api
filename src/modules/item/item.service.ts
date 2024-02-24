import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { IItemDoc, NewItem, UpdateItemBody } from './item.interfaces';
import Item from './item.model';

export const createItem = async (itemBody: NewItem): Promise<IItemDoc> => {
  if (await Item.isNameTaken(itemBody.name, itemBody.businessId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item with the entered name already exists.');
  }
  return Item.create(itemBody);
};

export const getItemById = async (id: mongoose.Types.ObjectId): Promise<IItemDoc | null> => Item.findById(id);

export const updateItemById = async (
  itemId: mongoose.Types.ObjectId,
  updateBody: UpdateItemBody
): Promise<IItemDoc | null> => {
  const item = await getItemById(itemId);
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found.');

  if (await Item.isNameTaken(updateBody.name!, updateBody.businessId!, itemId))
    throw new ApiError(httpStatus.NOT_FOUND, 'Item with the entered name already exists.');
  if (updateBody.businessId!.toString() !== item.businessId.toString())
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only edit your own items.');

  Object.assign(item, updateBody);
  await item.save();
  return item;
};
