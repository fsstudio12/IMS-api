import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import Sales from './sales.model';
import { IPayment, IPaymentInfo, ISalesDoc, ISalesItem, NewSales, UpdateSales } from './sales.interfaces';
import { findCustomerById } from '../customer/customer.service';
import { sanitizeItemParams } from '../item/item.service';
import {
  findIndexOfObjectFromArrayByField,
  findObjectFromArrayByField,
  getAddRemoveEditArrays,
  getTotalOfArrayByField,
  parseToInteger,
  setTwoDecimalPlaces,
  sortArrayByDate,
  splitFromQuery,
  stringifyObjectId,
} from '../utils/common';
import { PaymentMethod, PaymentStatus } from '../../config/enums';

export const generatePaymentInfo = (payment: Partial<IPayment>, items: ISalesItem[]): IPaymentInfo => {
  const total: number = getTotalOfArrayByField(items, 'price');

  let status: PaymentStatus;
  let paid: number;
  let remaining: number;
  let returned: number;
  const payments: IPayment[] = [];

  if (payment.amount === total) {
    status = PaymentStatus.PAID;
    paid = total;
    remaining = 0;
    returned = 0;
    payments.push({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(),
      amount: total,
      method: payment?.method ?? PaymentMethod.CASH,
    });
  } else if (payment.amount! > total) {
    status = PaymentStatus.PAID;
    paid = total;
    remaining = 0;
    returned = setTwoDecimalPlaces(payment.amount! - total);
    payments.push({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(),
      amount: total,
      method: payment?.method ?? PaymentMethod.CASH,
    });
  } else if (payment.amount! < total && payment.amount! > 0) {
    status = PaymentStatus.PARTIAL_PAID;
    paid = payment.amount!;
    remaining = setTwoDecimalPlaces(total - payment.amount!);
    returned = 0;
    payments.push({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(),
      amount: payment.amount!,
      method: payment?.method ?? PaymentMethod.CASH,
    });
  } else {
    status = PaymentStatus.NOT_PAID;
    paid = 0;
    remaining = total;
    returned = 0;
  }

  return {
    status,
    total,
    paid,
    remaining,
    returned,
    payments,
  };
};

export const createSales = async (salesBody: NewSales): Promise<ISalesDoc | null> => {
  const customer = await findCustomerById(salesBody.customerId);
  if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found.');

  const items = await sanitizeItemParams(salesBody.items, false, true);
  console.log('🚀 ~ createSales ~ items:', items);

  const date = new Date(salesBody.date);

  const paymentInfo: IPaymentInfo = generatePaymentInfo(salesBody.payment, items);

  const sales = Sales.create({
    businessId: salesBody.businessId,
    customerId: customer._id,
    paymentInfo,
    date,
    invoiceNumber: salesBody.invoiceNumber,
    items,
  });
  return sales;
};

export const getSalesWithMatchQuery = async (matchQuery: FilterQuery<ISalesDoc>): Promise<ISalesDoc[]> => {
  return Sales.aggregate([
    {
      $match: matchQuery,
    },
  ]);
};

export const getSalesByBusinessId = async (businessId: mongoose.Types.ObjectId): Promise<ISalesDoc[]> =>
  getSalesWithMatchQuery({ businessId });

export const findSalesByFilterQuery = async (filterQuery: FilterQuery<ISalesDoc>): Promise<ISalesDoc[]> =>
  Sales.find(filterQuery);

export const findSalesById = async (id: mongoose.Types.ObjectId): Promise<ISalesDoc | null> => Sales.findById(id);

export const findSingleSalesByFilterQuery = async (filterQuery: FilterQuery<ISalesDoc>): Promise<ISalesDoc | null> =>
  Sales.findOne(filterQuery);

export const findSalesByIdAndBusinessId = async (
  _id: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
): Promise<ISalesDoc | null> => {
  return findSingleSalesByFilterQuery({ _id, businessId });
};

export const getUpdatedPayments = (existingPayments: IPayment[], newPayments: IPayment[]): IPayment[] => {
  const {
    removeEntities: removePayments,
    editEntities: editPayments,
    addEntities: addPayments,
  } = getAddRemoveEditArrays(newPayments, existingPayments);

  const updatedPayments = existingPayments
    .filter(
      (payment) =>
        !removePayments.some(
          (removePayment: IPayment) => stringifyObjectId(removePayment._id) === stringifyObjectId(payment._id)
        )
    )
    .map(
      (payment) =>
        editPayments.find(
          (editPayment: IPayment) => stringifyObjectId(editPayment._id) === stringifyObjectId(payment._id)
        ) || payment
    )
    .concat(
      addPayments.map((addPayment: IPayment) => ({
        _id: new mongoose.Types.ObjectId(),
        amount: setTwoDecimalPlaces(addPayment.amount),
        method: addPayment.method ?? PaymentMethod.CASH,
        date: new Date(addPayment.date),
      }))
    );

  return sortArrayByDate(updatedPayments, 'date');
};

export const getUpdatedItemsForSales = (existingItems: ISalesItem[], newItems: ISalesItem[]): ISalesItem[] => {
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

  // // Remove items from the sale and update inventory
  // await Promise.all(
  //   removeItems.map(async (removeItem) => {
  //     await removeItemFromSales(removeItem._id);
  //     await updateInventory(removeItem, 'remove');
  //   })
  // );

  // // Edit items in the sale and update inventory
  // await Promise.all(
  //   editItems.map(async (editItem) => {
  //     await updateItemInSales(editItem._id, editItem);
  //     await updateInventory(editItem, 'edit');
  //   })
  // );

  // // Add items to the sale and update inventory
  // await Promise.all(
  //   addItems.map(async (addItem) => {
  //     await addItemToSales(addItem);
  //     await updateInventory(addItem, 'add');
  //   })
  // );

  // // Return the updated items
  // return [...editItems, ...addItems];
};

export const updatePaymentInfo = (payments: IPayment[], items: ISalesItem[]): IPaymentInfo => {
  const total: number = getTotalOfArrayByField(items, 'price');
  const paymentTotal: number = getTotalOfArrayByField(payments, 'amount');

  if (paymentTotal < 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Total Payment cannot be negative.');

  let status: PaymentStatus = PaymentStatus.NOT_PAID;
  const paid: number = paymentTotal;
  let remaining: number = 0;
  let returned: number = 0;

  if (total === paymentTotal) {
    status = PaymentStatus.PAID;
  } else if (paymentTotal > total) {
    status = PaymentStatus.PAID;
    returned = setTwoDecimalPlaces(paymentTotal - total);
  } else if (paymentTotal < total && paymentTotal > 0) {
    status = PaymentStatus.PARTIAL_PAID;
    remaining = setTwoDecimalPlaces(total - paymentTotal);
  } else {
    status = PaymentStatus.NOT_PAID;
    remaining = total;
  }

  return {
    status,
    total,
    paid,
    remaining,
    returned,
    payments,
  };
};

export const updateSalesById = async (
  salesId: mongoose.Types.ObjectId,
  salesBody: UpdateSales
): Promise<ISalesDoc | null> => {
  const sales = await findSalesById(salesId);
  if (!sales) throw new ApiError(httpStatus.NOT_FOUND, 'Sales not found.');

  if (stringifyObjectId(salesBody.businessId!) !== stringifyObjectId(sales.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own sales.');

  const customer = await findCustomerById(new mongoose.Types.ObjectId(salesBody.customerId));
  if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found.');

  const copiedSalesBody = { ...salesBody };
  const updatedPayments = getUpdatedPayments(sales.paymentInfo.payments, copiedSalesBody.paymentInfo.payments);

  const sanitizedItems = await sanitizeItemParams(copiedSalesBody.items, true);
  const updatedItems = getUpdatedItemsForSales(sales.items, sanitizedItems);
  const updatedPaymentInfo = updatePaymentInfo(updatedPayments, updatedItems);

  Object.assign(sales, {
    customerId: customer._id,
    paymentInfo: updatedPaymentInfo,
    date: new Date(copiedSalesBody.date),
    invoiceNumber: copiedSalesBody.invoiceNumber,
    items: updatedItems,
  });

  await sales.save();
  return sales;
};

export const deleteSales = async (querySalesId: string, businessId?: mongoose.Types.ObjectId): Promise<void> => {
  const salesIds = splitFromQuery(querySalesId);
  const mappedSalesIds = salesIds.map((itemId: string) => new mongoose.Types.ObjectId(itemId));

  const matchQuery: FilterQuery<ISalesDoc> = {
    _id: { $in: mappedSalesIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  await Sales.deleteMany(matchQuery);
};

export const addSalesPayment = async (
  salesId: mongoose.Types.ObjectId,
  paymentBody: IPayment
): Promise<ISalesDoc | null> => {
  const sales: ISalesDoc | null = await findSalesById(salesId);
  if (!sales) throw new ApiError(httpStatus.NOT_FOUND, 'Sales not found.');

  if (sales.paymentInfo.status === PaymentStatus.PAID)
    throw new ApiError(httpStatus.BAD_REQUEST, 'The sales has already been fully paid.');

  const payment: IPayment = {
    ...paymentBody,
    method: paymentBody?.method ?? PaymentMethod.CASH,
    _id: new mongoose.Types.ObjectId(),
  };

  const updatedPayments = [...sales.paymentInfo.payments, ...[payment]];

  const updatedPaymentInfo = updatePaymentInfo(updatedPayments, sales.items);
  sales.paymentInfo = updatedPaymentInfo;
  await sales.save();
  return sales;
};

export const updateSalesPayment = async (
  salesId: mongoose.Types.ObjectId,
  paymentId: mongoose.Types.ObjectId,
  paymentBody: IPayment
): Promise<ISalesDoc | null> => {
  const sales: ISalesDoc | null = await findSalesById(salesId);
  if (!sales) throw new ApiError(httpStatus.NOT_FOUND, 'Sales not found.');

  const payment: IPayment | null = findObjectFromArrayByField(sales.paymentInfo.payments, paymentId, '_id');
  if (!payment) throw new ApiError(httpStatus.NOT_FOUND, 'Sales Payment not found.');

  Object.assign(payment, { ...paymentBody, method: paymentBody?.method ?? PaymentMethod.CASH });

  const updatedPaymentInfo = updatePaymentInfo(sales.paymentInfo.payments, sales.items);
  sales.paymentInfo = updatedPaymentInfo;
  await sales.save();
  return sales;
};

export const removeSalesPayment = async (
  salesId: mongoose.Types.ObjectId,
  paymentId: mongoose.Types.ObjectId
): Promise<ISalesDoc | null> => {
  const sales: ISalesDoc | null = await findSalesById(salesId);
  if (!sales) throw new ApiError(httpStatus.NOT_FOUND, 'Sales not found.');

  const paymentIndex = findIndexOfObjectFromArrayByField(sales.paymentInfo.payments, paymentId, '_id');
  if (paymentIndex <= -1) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found.');

  sales.paymentInfo.payments.splice(paymentIndex, 1);

  const updatedPaymentInfo = updatePaymentInfo(sales.paymentInfo.payments, sales.items);
  sales.paymentInfo = updatedPaymentInfo;
  await sales.save();
  return sales;
};
