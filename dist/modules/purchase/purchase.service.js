"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseHistoryWithVendor = exports.removePurchasePayment = exports.updatePurchasePayment = exports.addPurchasePayment = exports.deletePurchase = exports.updatePurchaseById = exports.updatePaymentInfo = exports.getUpdatedItemsForPurchase = exports.getUpdatedPayments = exports.findPurchaseByIdAndBusinessId = exports.findPurchaseByFilterQuery = exports.findPurchaseById = exports.findPurchasesByFilterQuery = exports.getPurchasesByBusinessId = exports.getPurchasesWithMatchQuery = exports.createPurchase = exports.generatePaymentInfo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const purchase_model_1 = __importDefault(require("./purchase.model"));
const vendor_service_1 = require("../vendor/vendor.service");
const item_service_1 = require("../item/item.service");
const common_1 = require("../utils/common");
const enums_1 = require("../../config/enums");
const generatePaymentInfo = (payment, items) => {
    var _a, _b, _c;
    const total = (0, common_1.getTotalOfArrayByField)(items, 'price');
    let status;
    let paid;
    let remaining;
    let returned;
    const payments = [];
    if (payment.amount === total) {
        status = enums_1.PaymentStatus.PAID;
        paid = total;
        remaining = 0;
        returned = 0;
        payments.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            date: new Date(),
            amount: total,
            method: (_a = payment === null || payment === void 0 ? void 0 : payment.method) !== null && _a !== void 0 ? _a : enums_1.PaymentMethod.CASH,
        });
    }
    else if (payment.amount > total) {
        status = enums_1.PaymentStatus.PAID;
        paid = total;
        remaining = 0;
        returned = (0, common_1.setTwoDecimalPlaces)(payment.amount - total);
        payments.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            date: new Date(),
            amount: total,
            method: (_b = payment === null || payment === void 0 ? void 0 : payment.method) !== null && _b !== void 0 ? _b : enums_1.PaymentMethod.CASH,
        });
    }
    else if (payment.amount < total && payment.amount > 0) {
        status = enums_1.PaymentStatus.PARTIAL_PAID;
        paid = payment.amount;
        remaining = (0, common_1.setTwoDecimalPlaces)(total - payment.amount);
        returned = 0;
        payments.push({
            _id: new mongoose_1.default.Types.ObjectId(),
            date: new Date(),
            amount: payment.amount,
            method: (_c = payment === null || payment === void 0 ? void 0 : payment.method) !== null && _c !== void 0 ? _c : enums_1.PaymentMethod.CASH,
        });
    }
    else {
        status = enums_1.PaymentStatus.NOT_PAID;
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
exports.generatePaymentInfo = generatePaymentInfo;
const createPurchase = async (purchaseBody) => {
    const vendor = await (0, vendor_service_1.findVendorById)(purchaseBody.vendorId);
    if (!vendor)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Vendor not found.');
    const items = (await (0, item_service_1.sanitizeItemParams)(purchaseBody.items, true));
    const date = (purchaseBody === null || purchaseBody === void 0 ? void 0 : purchaseBody.date) ? new Date(purchaseBody === null || purchaseBody === void 0 ? void 0 : purchaseBody.date) : new Date();
    const paymentInfo = (0, exports.generatePaymentInfo)(purchaseBody.payment, items);
    const purchase = purchase_model_1.default.create({
        businessId: purchaseBody.businessId,
        vendorId: vendor._id,
        paymentInfo,
        date,
        invoiceNumber: purchaseBody.invoiceNumber,
        items,
    });
    return purchase;
};
exports.createPurchase = createPurchase;
const getPurchasesWithMatchQuery = (matchQuery) => {
    return purchase_model_1.default.aggregate([
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
exports.getPurchasesWithMatchQuery = getPurchasesWithMatchQuery;
const getPurchasesByBusinessId = async (businessId) => (0, exports.getPurchasesWithMatchQuery)({ businessId });
exports.getPurchasesByBusinessId = getPurchasesByBusinessId;
const findPurchasesByFilterQuery = async (filterQuery) => purchase_model_1.default.find(filterQuery);
exports.findPurchasesByFilterQuery = findPurchasesByFilterQuery;
const findPurchaseById = async (id) => purchase_model_1.default.findById(id);
exports.findPurchaseById = findPurchaseById;
const findPurchaseByFilterQuery = async (filterQuery) => purchase_model_1.default.findOne(filterQuery);
exports.findPurchaseByFilterQuery = findPurchaseByFilterQuery;
const findPurchaseByIdAndBusinessId = async (_id, businessId) => {
    return (0, exports.findPurchaseByFilterQuery)({ _id, businessId });
};
exports.findPurchaseByIdAndBusinessId = findPurchaseByIdAndBusinessId;
const getUpdatedPayments = (existingPayments, newPayments) => {
    const { removeEntities: removePayments, editEntities: editPayments, addEntities: addPayments, } = (0, common_1.getAddRemoveEditArrays)(newPayments, existingPayments);
    const updatedPayments = existingPayments
        .filter((payment) => !removePayments.some((removePayment) => (0, common_1.stringifyObjectId)(removePayment._id) === (0, common_1.stringifyObjectId)(payment._id)))
        .map((payment) => editPayments.find((editPayment) => (0, common_1.stringifyObjectId)(editPayment._id) === (0, common_1.stringifyObjectId)(payment._id)) || payment)
        .concat(addPayments.map((addPayment) => {
        var _a;
        return ({
            _id: new mongoose_1.default.Types.ObjectId(),
            amount: (0, common_1.setTwoDecimalPlaces)(addPayment.amount),
            method: (_a = addPayment.method) !== null && _a !== void 0 ? _a : enums_1.PaymentMethod.CASH,
            date: new Date(addPayment.date),
        });
    }));
    const sortedPayments = (0, common_1.sortArrayByDate)(updatedPayments, 'date').map((payment, paymentIndex) => (Object.assign(Object.assign({}, payment), { title: `${(0, common_1.getOrderString)(paymentIndex + 1)} Payment` })));
    return sortedPayments;
};
exports.getUpdatedPayments = getUpdatedPayments;
const getUpdatedItemsForPurchase = (existingItems, newItems) => {
    const { addEntities: addItems, removeEntities: removeItems, editEntities: editItems, } = (0, common_1.getAddRemoveEditArrays)(newItems, existingItems);
    for (const removeItem of removeItems) {
        for (const [index, value] of Object.entries(existingItems)) {
            if ((0, common_1.stringifyObjectId)(removeItem._id) === (0, common_1.stringifyObjectId)(value._id)) {
                existingItems.splice((0, common_1.parseToInteger)(index), 1);
                // update inventory amount of removed items
            }
        }
    }
    for (const editItem of editItems) {
        for (const checkPaymentForParams of newItems) {
            if ((0, common_1.stringifyObjectId)(editItem._id) === (0, common_1.stringifyObjectId)(checkPaymentForParams._id)) {
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
exports.getUpdatedItemsForPurchase = getUpdatedItemsForPurchase;
const updatePaymentInfo = (payments, items) => {
    const total = (0, common_1.getTotalOfArrayByField)(items, 'price');
    const paymentTotal = (0, common_1.getTotalOfArrayByField)(payments, 'amount');
    if (paymentTotal < 0)
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Total Payment cannot be negative.');
    let status = enums_1.PaymentStatus.NOT_PAID;
    const paid = paymentTotal;
    let remaining = 0;
    let returned = 0;
    if (total === paymentTotal) {
        status = enums_1.PaymentStatus.PAID;
    }
    else if (paymentTotal > total) {
        status = enums_1.PaymentStatus.PAID;
        returned = (0, common_1.setTwoDecimalPlaces)(paymentTotal - total);
    }
    else if (paymentTotal < total && paymentTotal > 0) {
        status = enums_1.PaymentStatus.PARTIAL_PAID;
        remaining = (0, common_1.setTwoDecimalPlaces)(total - paymentTotal);
    }
    else {
        status = enums_1.PaymentStatus.NOT_PAID;
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
exports.updatePaymentInfo = updatePaymentInfo;
const updatePurchaseById = async (purchaseId, purchaseBody) => {
    const purchase = await (0, exports.findPurchaseById)(purchaseId);
    if (!purchase)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Purchase not found.');
    if ((0, common_1.stringifyObjectId)(purchaseBody.businessId) !== (0, common_1.stringifyObjectId)(purchase.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'You can only update your own purchases.');
    const vendor = await (0, vendor_service_1.findVendorById)(new mongoose_1.default.Types.ObjectId(purchaseBody.vendorId));
    if (!vendor)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Vendor not found.');
    const copiedPurchaseBody = Object.assign({}, purchaseBody);
    const updatedPayments = (0, exports.getUpdatedPayments)(purchase.paymentInfo.payments, copiedPurchaseBody.paymentInfo.payments);
    const sanitizedItems = (await (0, item_service_1.sanitizeItemParams)(copiedPurchaseBody.items, true));
    const updatedItems = (0, exports.getUpdatedItemsForPurchase)(purchase.items, sanitizedItems);
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(updatedPayments, updatedItems);
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
exports.updatePurchaseById = updatePurchaseById;
const deletePurchase = async (queryPurchasesId, businessId) => {
    const purchaseIds = (0, common_1.splitFromQuery)(queryPurchasesId);
    const mappedPurchaseIds = purchaseIds.map((itemId) => new mongoose_1.default.Types.ObjectId(itemId));
    const matchQuery = {
        _id: { $in: mappedPurchaseIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    await purchase_model_1.default.deleteMany(matchQuery);
};
exports.deletePurchase = deletePurchase;
const addPurchasePayment = async (purchaseId, paymentBody) => {
    var _a;
    const purchase = await (0, exports.findPurchaseById)(purchaseId);
    if (!purchase)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Purchase not found.');
    if (purchase.paymentInfo.status === enums_1.PaymentStatus.PAID)
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'The purchase has already been fully paid.');
    const payment = Object.assign(Object.assign({}, paymentBody), { date: paymentBody.date ? new Date(paymentBody.date) : new Date(), method: (_a = paymentBody === null || paymentBody === void 0 ? void 0 : paymentBody.method) !== null && _a !== void 0 ? _a : enums_1.PaymentMethod.CASH, _id: new mongoose_1.default.Types.ObjectId() });
    const copiedPurchase = (0, common_1.deepCopy)(purchase);
    const updatedPayments = (0, exports.getUpdatedPayments)(copiedPurchase.paymentInfo.payments, [
        ...copiedPurchase.paymentInfo.payments,
        ...[payment],
    ]);
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(updatedPayments, purchase.items);
    purchase.paymentInfo = updatedPaymentInfo;
    await purchase.save();
    return purchase;
};
exports.addPurchasePayment = addPurchasePayment;
const updatePurchasePayment = async (purchaseId, paymentId, paymentBody) => {
    var _a;
    const purchase = await (0, exports.findPurchaseById)(purchaseId);
    if (!purchase)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Purchase not found.');
    const payment = (0, common_1.findObjectFromArrayByField)(purchase.paymentInfo.payments, paymentId, '_id');
    if (!payment)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Purchase Payment not found.');
    Object.assign(payment, Object.assign(Object.assign({}, paymentBody), { method: (_a = paymentBody === null || paymentBody === void 0 ? void 0 : paymentBody.method) !== null && _a !== void 0 ? _a : enums_1.PaymentMethod.CASH }));
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(purchase.paymentInfo.payments, purchase.items);
    purchase.paymentInfo = updatedPaymentInfo;
    await purchase.save();
    return purchase;
};
exports.updatePurchasePayment = updatePurchasePayment;
const removePurchasePayment = async (purchaseId, paymentId) => {
    const purchase = await (0, exports.findPurchaseById)(purchaseId);
    if (!purchase)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Purchase not found.');
    const paymentIndex = (0, common_1.findIndexOfObjectFromArrayByField)(purchase.paymentInfo.payments, paymentId, '_id');
    if (paymentIndex <= -1)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Payment not found.');
    purchase.paymentInfo.payments.splice(paymentIndex, 1);
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(purchase.paymentInfo.payments, purchase.items);
    purchase.paymentInfo = updatedPaymentInfo;
    await purchase.save();
    return purchase;
};
exports.removePurchasePayment = removePurchasePayment;
const getPurchaseHistoryWithVendor = async (vendorId, businessId) => {
    return (0, exports.getPurchasesWithMatchQuery)({
        vendorId,
        businessId,
    });
};
exports.getPurchaseHistoryWithVendor = getPurchaseHistoryWithVendor;
//# sourceMappingURL=purchase.service.js.map