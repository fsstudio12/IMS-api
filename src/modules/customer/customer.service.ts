import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';

import { ICustomerDoc, NewCustomer, UpdateCustomer } from './customer.interfaces';
import Customer from './customer.model';
import { ApiError } from '../errors';
import { mapFromArrayByField, splitFromQuery, stringifyObjectId } from '../utils/common';
import { CustomerType } from '../../config/enums';
import { deleteObjectsFromBucket } from '../utils/s3Operations';
import config from '../../config/config';
import { getMultipleFileDeleteParams, gets3FileUrl } from '../utils/fileOperations';

export const findCustomersByFilterQuery = async (filterQuery: FilterQuery<ICustomerDoc>): Promise<ICustomerDoc[]> =>
  Customer.find(filterQuery);

export const findCustomerById = async (customerId: mongoose.Types.ObjectId): Promise<ICustomerDoc | null> =>
  Customer.findById(customerId);

export const findCustomerByFilterQuery = async (filterQuery: FilterQuery<ICustomerDoc>): Promise<ICustomerDoc | null> =>
  Customer.findOne(filterQuery);

export const createCustomer = async (customerBody: NewCustomer): Promise<ICustomerDoc> => {
  if (await Customer.isNameTaken(customerBody.name, customerBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer with the entered name already exists.');
  if (await Customer.isPhoneTaken(customerBody.phone, customerBody.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer with the entered phone already exists.');
  if (customerBody.type === CustomerType.INDIVIDUAL && (customerBody.registrationType || customerBody.registrationNumber))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer of Individual type cannot have registration number and type.');

  const sanitizedCustomerBody = { ...customerBody };
  if (customerBody.image) {
    const imageUrl = await gets3FileUrl(null, sanitizedCustomerBody.image, config.aws.customersFolder);
    sanitizedCustomerBody.image = imageUrl;
  }

  sanitizedCustomerBody.registrationType = customerBody?.registrationType ? customerBody?.registrationType : null;

  return Customer.create(sanitizedCustomerBody);
};

export const updateCustomerById = async (
  customerId: mongoose.Types.ObjectId,
  customerBody: UpdateCustomer
): Promise<ICustomerDoc> => {
  const customer = await findCustomerById(customerId);
  if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found.');

  if (await Customer.isNameTaken(customerBody.name!, customerBody.businessId!, customerId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer with the entered name already exists.');
  if (stringifyObjectId(customerBody.businessId!) !== stringifyObjectId(customer.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own customer.');

  const sanitizedCustomerBody = { ...customerBody };
  if (sanitizedCustomerBody.image) {
    sanitizedCustomerBody.image = await gets3FileUrl(
      customer.image,
      sanitizedCustomerBody.image,
      config.aws.customersFolder
    );
  }

  sanitizedCustomerBody.registrationType = customerBody?.registrationType ? customerBody?.registrationType : null;

  Object.assign(customer, sanitizedCustomerBody);
  await customer.save();
  return customer;
};

export const deleteCustomersById = async (queryCustomerIds: string, businessId?: mongoose.Types.ObjectId): Promise<void> => {
  const customerIds = splitFromQuery(queryCustomerIds).map((customerId: string) => new mongoose.Types.ObjectId(customerId));

  const filterQuery: FilterQuery<ICustomerDoc> = {
    _id: { $in: customerIds },
  };

  if (businessId) {
    filterQuery.businessId = businessId;
  }

  const customers = await findCustomersByFilterQuery(filterQuery);
  const imageUrls = mapFromArrayByField(customers, 'image');
  const deleteParams = getMultipleFileDeleteParams(imageUrls);
  await deleteObjectsFromBucket(deleteParams);

  await Customer.deleteMany(filterQuery);
};
