// import httpStatus from 'http-status';
// import mongoose, { FilterQuery } from 'mongoose';
// import { IUtilityPaymentDoc, NewUtilityPayment } from './utilityPayment.interfaces';
// import UtilityPayment from './utilityPayment.model';
// import { ApiError } from '../errors';

// export const findUtilitiesByFilterQuery = async (filterQuery: FilterQuery<IUtilityPaymentDoc>): Promise<IUtilityPaymentDoc[]> =>
//   UtilityPayment.find(filterQuery);

// export const findUtilityPaymentById = async (id: mongoose.Types.ObjectId): Promise<IUtilityPaymentDoc | null> => UtilityPayment.findById(id);

// export const findUtilityPaymentByFilterQuery = async (filterQuery: FilterQuery<IUtilityPaymentDoc>): Promise<IUtilityPaymentDoc | null> =>
//   UtilityPayment.findOne(filterQuery);

// export const findUtilityPaymentByIdAndBusinessId = async (
//   _id: mongoose.Types.ObjectId,
//   businessId: mongoose.Types.ObjectId
// ): Promise<IUtilityPaymentDoc | null> => {
//   return findUtilityPaymentByFilterQuery({ _id, businessId });
// };

// export const createUtilityPayment = async (utilityPaymentBody: NewUtilityPayment) => {
//   const utilityPayment = await UtilityPayment.create(utilityPaymentBody);
//   return utilityPayment;
// };

// export const updateUtilityPaymentById = async (utilityPaymentId: mongoose.Types.ObjectId, utilityPaymentBody: NewUtilityPayment) => {
//   const utilityPayment = await findUtilityPaymentById(utilityPaymentId);
//   if (!utilityPayment) throw new ApiError(httpStatus.NOT_FOUND, 'UtilityPayment not found.');

//   Object.assign(utilityPayment, utilityPaymentBody);
//   await utilityPayment.save();
//   return utilityPayment;
// };
