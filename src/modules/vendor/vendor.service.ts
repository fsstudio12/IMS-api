import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';

import { IVendorDoc, NewVendor, UpdateVendor } from './vendor.interfaces';
import Vendor from './vendor.model';
import { ApiError } from '../errors';
import { splitFromQuery, stringifyObjectId } from '../utils/common';

export const findVendorsByFilterQuery = async (filterQuery: FilterQuery<IVendorDoc>): Promise<IVendorDoc[]> =>
  Vendor.find(filterQuery);

export const findVendorById = async (vendorId: mongoose.Types.ObjectId): Promise<IVendorDoc | null> =>
  Vendor.findById(vendorId);

export const findVendorByFilterQuery = async (filterQuery: FilterQuery<IVendorDoc>): Promise<IVendorDoc | null> =>
  Vendor.findOne(filterQuery);

export const createVendor = async (vendorBody: NewVendor): Promise<IVendorDoc> => {
  if (await Vendor.isNameTaken(vendorBody.name, vendorBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vendor with the entered name already exists.');

  return Vendor.create(vendorBody);
};

export const updateVendorById = async (vendorId: mongoose.Types.ObjectId, vendorBody: UpdateVendor): Promise<IVendorDoc> => {
  const vendor = await findVendorById(vendorId);
  if (!vendor) throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found.');

  if (await Vendor.isNameTaken(vendorBody.name!, vendorBody.businessId!, vendorId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vendor with the entered name already exists.');
  if (stringifyObjectId(vendorBody.businessId!) !== stringifyObjectId(vendor.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own vendor.');

  Object.assign(vendor, vendorBody);
  await vendor.save();
  return vendor;
};

export const deleteVendorById = async (queryVendorIds: string, businessId?: mongoose.Types.ObjectId): Promise<void> => {
  const vendorIds = splitFromQuery(queryVendorIds).map((vendorId: string) => new mongoose.Types.ObjectId(vendorId));

  const matchQuery: FilterQuery<IVendorDoc> = {
    _id: { $in: vendorIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  await Vendor.deleteMany(matchQuery);
};
