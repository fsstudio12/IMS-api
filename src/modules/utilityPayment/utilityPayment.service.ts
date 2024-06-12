import httpStatus from 'http-status';
import mongoose, { FilterQuery } from 'mongoose';
import { PaymentMethod } from '../../config/enums';
import { IEachUtilityPayment, IUtilityPayment, IUtilityPaymentDoc, NewUtilityPayment } from './utilityPayment.interfaces';
import UtilityPayment from './utilityPayment.model';
import { ApiError } from '../errors';
import { splitFromQuery } from '../utils/common';
import { findUtilityById } from '../utility/utility.service';
import { IPayment } from '../purchase/purchase.interfaces';

export const findUtilityPaymentsByFilterQuery = async (
  filterQuery: FilterQuery<IUtilityPaymentDoc>
): Promise<IUtilityPaymentDoc[]> => UtilityPayment.find(filterQuery);

export const findUtilityPaymentById = async (id: mongoose.Types.ObjectId): Promise<IUtilityPaymentDoc | null> =>
  UtilityPayment.findById(id);

export const findUtilityPaymentByFilterQuery = async (
  filterQuery: FilterQuery<IUtilityPaymentDoc>
): Promise<IUtilityPaymentDoc | null> => UtilityPayment.findOne(filterQuery);

export const findUtilityPaymentByIdAndBusinessId = async (
  _id: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
): Promise<IUtilityPaymentDoc | null> => {
  return findUtilityPaymentByFilterQuery({ _id, businessId });
};

export const getUtilityPaymentsByFilterQuery = async (
  filterQuery: FilterQuery<IUtilityPaymentDoc>
): Promise<IUtilityPaymentDoc[]> =>
  UtilityPayment.aggregate([
    {
      $match: filterQuery,
    },
    {
      $project: {
        title: 1,
        date: 1,
        timeline: {
          from: '$from',
          to: '$to',
        },
        utilities: 1,
      },
    },
  ]);

export const validateUtilities = async (utilities: IEachUtilityPayment[]) => {
  const validationPromises = utilities.map(async (utility: IEachUtilityPayment) => {
    const checkUtility = await findUtilityById(utility._id);
    if (!checkUtility) throw new ApiError(httpStatus.NOT_FOUND, 'Selected utility not found.');

    const updatedUtility = {
      _id: checkUtility._id,
      title: checkUtility.title,
      payments: utility.payments.map((payment: Partial<IPayment>) => ({
        _id: payment._id ? new mongoose.Types.ObjectId(payment._id) : new mongoose.Types.ObjectId(),
        date: payment.date ?? new Date(),
        amount: payment.amount!,
        method: payment?.method ?? PaymentMethod.CASH,
      })),
    };

    return updatedUtility;
  });

  const validatedUtilities = await Promise.all(validationPromises);
  return validatedUtilities;
};

export const createUtilityPayment = async (utilityPaymentBody: NewUtilityPayment) => {
  const validatedUtilities = await validateUtilities(utilityPaymentBody.utilities);
  const utilityPayment = await UtilityPayment.create({
    ...utilityPaymentBody,
    utilities: validatedUtilities,
  });
  return utilityPayment;
};

export const updateUtilityPaymentById = async (
  utilityPaymentId: mongoose.Types.ObjectId,
  utilityPaymentBody: IUtilityPayment
): Promise<IUtilityPaymentDoc> => {
  const utilityPayment = await findUtilityPaymentById(utilityPaymentId);
  if (!utilityPayment) throw new ApiError(httpStatus.NOT_FOUND, 'UtilityPayment not found.');

  const validatedUtilities = await validateUtilities(utilityPaymentBody.utilities);

  Object.assign(utilityPayment, {
    ...utilityPaymentBody,
    utilities: validatedUtilities,
  });
  await utilityPayment.save();
  return utilityPayment;
};

export const deleteUtilityPaymentsById = async (queryUtilityPaymentIds: string, businessId?: mongoose.Types.ObjectId) => {
  const utilityPaymentIds = splitFromQuery(queryUtilityPaymentIds);
  const mappedUtilityPaymentIds = utilityPaymentIds.map(
    (utilityPaymentId: string) => new mongoose.Types.ObjectId(utilityPaymentId)
  );

  const matchQuery: FilterQuery<IUtilityPaymentDoc> = {
    _id: { $in: mappedUtilityPaymentIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  await UtilityPayment.deleteMany(matchQuery);
};
