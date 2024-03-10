import mongoose, { FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import Purchase from './purchase.model';
import { IPayment, IPaymentInfo, IPurchaseDoc, NewPurchase, UpdatePurchase } from './purchase.interfaces';
import { findVendorById } from '../vendor/vendor.service';
import { sanitizeItemParams } from '../item/item.service';
import {
  deepCopy,
  findIndexOfObjectFromArrayByField,
  findObjectFromArrayByField,
  getAddRemoveEditArrays,
  getOrderString,
  getTotalOfArrayByField,
  parseToInteger,
  setTwoDecimalPlaces,
  sortArrayByDate,
  splitFromQuery,
  stringifyObjectId,
} from '../utils/common';
import { PaymentMethod, PaymentStatus } from '../../config/enums';
import { ICombinationItem } from '../item/item.interfaces';

export const generatePaymentInfo = (payment: Partial<IPayment>, items: ICombinationItem[]): IPaymentInfo => {
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

export const createPurchase = async (purchaseBody: NewPurchase): Promise<IPurchaseDoc | null> => {
  const vendor = await findVendorById(purchaseBody.vendorId);
  if (!vendor) throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found.');

  const items = (await sanitizeItemParams(purchaseBody.items, true)) as ICombinationItem[];
  const date = new Date(purchaseBody.date);

  const paymentInfo: IPaymentInfo = generatePaymentInfo(purchaseBody.payment, items);

  const purchase = Purchase.create({
    businessId: purchaseBody.businessId,
    vendorId: vendor._id,
    paymentInfo,
    date,
    invoiceNumber: purchaseBody.invoiceNumber,
    items,
  });
  return purchase;
};

export const getPurchasesWithMatchQuery = async (matchQuery: FilterQuery<IPurchaseDoc>): Promise<IPurchaseDoc[]> => {
  return Purchase.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: 'vendors',
        localField: 'vendorId',
        foreignField: '_id',
        as: 'vendorInfo',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              registrationType: 1,
              registrationNumber: 1,
              address: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        invoiceNumber: 1,
        date: 1,
        paymentInfo: 1,
        items: 1,
        vendorInfo: { $first: '$vendorInfo' },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
};

export const getPurchasesByBusinessId = async (businessId: mongoose.Types.ObjectId): Promise<IPurchaseDoc[]> =>
  getPurchasesWithMatchQuery({ businessId });

export const findPurchasesByFilterQuery = async (filterQuery: FilterQuery<IPurchaseDoc>): Promise<IPurchaseDoc[]> =>
  Purchase.find(filterQuery);

export const findPurchaseById = async (id: mongoose.Types.ObjectId): Promise<IPurchaseDoc | null> => Purchase.findById(id);

export const findPurchaseByFilterQuery = async (filterQuery: FilterQuery<IPurchaseDoc>): Promise<IPurchaseDoc | null> =>
  Purchase.findOne(filterQuery);

export const findPurchaseByIdAndBusinessId = async (
  _id: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
): Promise<IPurchaseDoc | null> => {
  return findPurchaseByFilterQuery({ _id, businessId });
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

  const sortedPayments = sortArrayByDate(updatedPayments, 'date').map((payment: IPayment, paymentIndex: number) => ({
    ...payment,
    title: `${getOrderString(paymentIndex + 1)} Payment`,
  }));
  return sortedPayments;
};

export const getUpdatedItemsForPurchase = (
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

export const updatePaymentInfo = (payments: IPayment[], items: ICombinationItem[]): IPaymentInfo => {
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

export const updatePurchaseById = async (
  purchaseId: mongoose.Types.ObjectId,
  purchaseBody: UpdatePurchase
): Promise<IPurchaseDoc | null> => {
  const purchase = await findPurchaseById(purchaseId);
  if (!purchase) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found.');

  if (stringifyObjectId(purchaseBody.businessId!) !== stringifyObjectId(purchase.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own purchases.');

  const vendor = await findVendorById(new mongoose.Types.ObjectId(purchaseBody.vendorId));
  if (!vendor) throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found.');

  const copiedPurchaseBody = { ...purchaseBody };
  const updatedPayments = getUpdatedPayments(purchase.paymentInfo.payments, copiedPurchaseBody.paymentInfo.payments);

  const sanitizedItems = (await sanitizeItemParams(copiedPurchaseBody.items, true)) as ICombinationItem[];
  const updatedItems = getUpdatedItemsForPurchase(purchase.items, sanitizedItems);
  const updatedPaymentInfo = updatePaymentInfo(updatedPayments, updatedItems);

  Object.assign(purchase, {
    vendorId: vendor._id,
    paymentInfo: updatedPaymentInfo,
    date: new Date(copiedPurchaseBody.date),
    invoiceNumber: copiedPurchaseBody.invoiceNumber,
    items: updatedItems,
  });

  await purchase.save();
  return purchase;
};

export const deletePurchase = async (queryPurchasesId: string, businessId?: mongoose.Types.ObjectId): Promise<void> => {
  const purchaseIds = splitFromQuery(queryPurchasesId);
  const mappedPurchaseIds = purchaseIds.map((itemId: string) => new mongoose.Types.ObjectId(itemId));

  const matchQuery: FilterQuery<IPurchaseDoc> = {
    _id: { $in: mappedPurchaseIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  await Purchase.deleteMany(matchQuery);
};

export const addPurchasePayment = async (
  purchaseId: mongoose.Types.ObjectId,
  paymentBody: IPayment
): Promise<IPurchaseDoc | null> => {
  const purchase: IPurchaseDoc | null = await findPurchaseById(purchaseId);
  if (!purchase) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found.');

  if (purchase.paymentInfo.status === PaymentStatus.PAID)
    throw new ApiError(httpStatus.BAD_REQUEST, 'The purchase has already been fully paid.');

  const payment: IPayment = {
    ...paymentBody,
    date: paymentBody.date ? new Date(paymentBody.date) : new Date(),
    method: paymentBody?.method ?? PaymentMethod.CASH,
    _id: new mongoose.Types.ObjectId(),
  };

  const copiedPurchase = deepCopy(purchase);

  const updatedPayments = getUpdatedPayments(copiedPurchase.paymentInfo.payments, [
    ...copiedPurchase.paymentInfo.payments,
    ...[payment],
  ]);

  const updatedPaymentInfo = updatePaymentInfo(updatedPayments, purchase.items);
  purchase.paymentInfo = updatedPaymentInfo;
  await purchase.save();
  return purchase;
};

export const updatePurchasePayment = async (
  purchaseId: mongoose.Types.ObjectId,
  paymentId: mongoose.Types.ObjectId,
  paymentBody: IPayment
): Promise<IPurchaseDoc | null> => {
  const purchase: IPurchaseDoc | null = await findPurchaseById(purchaseId);
  if (!purchase) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found.');

  const payment: IPayment | null = findObjectFromArrayByField(purchase.paymentInfo.payments, paymentId, '_id');
  if (!payment) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Payment not found.');

  Object.assign(payment, { ...paymentBody, method: paymentBody?.method ?? PaymentMethod.CASH });

  const updatedPaymentInfo = updatePaymentInfo(purchase.paymentInfo.payments, purchase.items);
  purchase.paymentInfo = updatedPaymentInfo;
  await purchase.save();
  return purchase;
};

export const removePurchasePayment = async (
  purchaseId: mongoose.Types.ObjectId,
  paymentId: mongoose.Types.ObjectId
): Promise<IPurchaseDoc | null> => {
  const purchase: IPurchaseDoc | null = await findPurchaseById(purchaseId);
  if (!purchase) throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found.');

  const paymentIndex = findIndexOfObjectFromArrayByField(purchase.paymentInfo.payments, paymentId, '_id');
  if (paymentIndex <= -1) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found.');

  purchase.paymentInfo.payments.splice(paymentIndex, 1);

  const updatedPaymentInfo = updatePaymentInfo(purchase.paymentInfo.payments, purchase.items);
  purchase.paymentInfo = updatedPaymentInfo;
  await purchase.save();
  return purchase;
};

export const getPurchaseHistoryWithVendor = async (
  vendorId: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
) => {
  return getPurchasesWithMatchQuery({
    vendorId,
    businessId,
  });
};
