import mongoose, { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { IBusinessDoc, NewCreatedBusiness, UpdateBusinessBody } from './business.interfaces';
import Business from './business.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import { User } from '../user';

export const createBusiness = async (
  businessBody: NewCreatedBusiness,
  session: ClientSession | null
): Promise<IBusinessDoc> => {
  if (await Business.isNameTaken(businessBody.name))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Business with the entered name already exists.');

  if (await Business.isEmailTaken(businessBody.email))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Business with the entered email already exists.');

  const options = session ? { session } : undefined;

  const [business] = await Business.create([businessBody], options);
  if (!business) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong.');

  return business;
};

export const queryBusinesses = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const businesses = await Business.paginate(filter, options);
  return businesses;
};

export const getBusinessById = async (id: mongoose.Types.ObjectId): Promise<IBusinessDoc | null> => Business.findById(id);

export const getBusinessByEmail = async (email: string): Promise<IBusinessDoc | null> => Business.findOne({ email });

export const updateBusinessById = async (
  businessId: mongoose.Types.ObjectId,
  updateBody: UpdateBusinessBody
): Promise<IBusinessDoc | null> => {
  const business = await getBusinessById(businessId);
  if (!business) throw new ApiError(httpStatus.NOT_FOUND, 'Business not found.');

  if (updateBody.email && (await Business.isEmailTaken(updateBody.email, businessId)))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken.');

  Object.assign(business, updateBody);
  await business.save();
  return business;
};

export const deleteBusinessById = async (
  businessId: mongoose.Types.ObjectId,
  session: ClientSession | null
): Promise<IBusinessDoc | null> => {
  const options = session ? { session } : undefined;
  const business = await getBusinessById(businessId);
  if (!business) throw new ApiError(httpStatus.NOT_FOUND, 'Business not found.');

  await Promise.all([
    User.deleteMany(
      {
        businessId,
      },
      options
    ),
    // delete other documents related with the business

    business.deleteOne(options),
  ]);
  return business;
};
