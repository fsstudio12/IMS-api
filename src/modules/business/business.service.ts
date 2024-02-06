import { ClientSession } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { IBusinessDoc, NewCreatedBusiness } from './business.interfaces';
import Business from './business.model';
import { IOptions, QueryResult } from '../paginate/paginate';

export const createBusiness = async (
  businessBody: NewCreatedBusiness,
  session: ClientSession | null
): Promise<IBusinessDoc> => {
  if (await Business.isNameTaken(businessBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Business with the entered name already exists.');
  }
  if (await Business.isEmailTaken(businessBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Business with the entered email already exists.');
  }
  const options = session ? { session } : undefined;

  const [business] = await Business.create([businessBody], options);
  if (!business) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong.');
  }
  return business;
};

export const queryBusinesses = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const businesses = await Business.paginate(filter, options);
  return businesses;
};

// const business: Document<unknown, {}, IBusinessDoc> & IBusinessDoc & {
//   _id: Types.ObjectId;
// }
