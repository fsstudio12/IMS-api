"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSalesPayment = exports.updateSalesPayment = exports.addSalesPayment = exports.deleteSales = exports.updateSalesById = exports.updatePaymentInfo = exports.getUpdatedItemsForSales = exports.findSalesByIdAndBusinessId = exports.findSingleSalesByFilterQuery = exports.findSalesById = exports.findSalesByFilterQuery = exports.getSalesByBusinessId = exports.getSalesWithMatchQuery = exports.createSales = exports.generatePaymentInfo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const sales_model_1 = __importDefault(require("./sales.model"));
const customer_service_1 = require("../customer/customer.service");
const item_service_1 = require("../item/item.service");
const common_1 = require("../utils/common");
const enums_1 = require("../../config/enums");
const purchase_service_1 = require("../purchase/purchase.service");
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
const createSales = async (salesBody) => {
    const customer = await (0, customer_service_1.findCustomerById)(salesBody.customerId);
    if (!customer)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Customer not found.');
    const items = (await (0, item_service_1.sanitizeItemParams)(salesBody.items, false, true));
    const date = (salesBody === null || salesBody === void 0 ? void 0 : salesBody.date) ? new Date(salesBody === null || salesBody === void 0 ? void 0 : salesBody.date) : new Date();
    const paymentInfo = (0, exports.generatePaymentInfo)(salesBody.payment, items);
    const salesParams = {
        businessId: salesBody.businessId,
        customerId: customer._id,
        paymentInfo,
        date,
        invoiceNumber: salesBody.invoiceNumber,
        items,
    };
    const sales = sales_model_1.default.create(salesParams);
    return sales;
};
exports.createSales = createSales;
const getSalesWithMatchQuery = async (matchQuery) => {
    return sales_model_1.default.aggregate([
        {
            $match: matchQuery,
        },
        {
            $addFields: {
                status: '$paymentInfo.status',
                paid: '$paymentInfo.paid',
            },
        },
        {
            $lookup: {
                from: 'customers',
                localField: 'customerId',
                foreignField: '_id',
                as: 'customer',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            phone: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                _id: 1,
                paymentInfo: 1,
                date: 1,
                invoiceNumber: 1,
                items: 1,
                createdAt: 1,
                updatedAt: 1,
                status: 1,
                paid: 1,
                customer: { $first: '$customer' },
            },
        },
    ]);
};
exports.getSalesWithMatchQuery = getSalesWithMatchQuery;
const getSalesByBusinessId = async (businessId) => (0, exports.getSalesWithMatchQuery)({ businessId });
exports.getSalesByBusinessId = getSalesByBusinessId;
const findSalesByFilterQuery = async (filterQuery) => sales_model_1.default.find(filterQuery);
exports.findSalesByFilterQuery = findSalesByFilterQuery;
const findSalesById = async (id) => sales_model_1.default.findById(id);
exports.findSalesById = findSalesById;
const findSingleSalesByFilterQuery = async (filterQuery) => sales_model_1.default.findOne(filterQuery);
exports.findSingleSalesByFilterQuery = findSingleSalesByFilterQuery;
const findSalesByIdAndBusinessId = async (_id, businessId) => {
    return (0, exports.findSingleSalesByFilterQuery)({ _id, businessId });
};
exports.findSalesByIdAndBusinessId = findSalesByIdAndBusinessId;
const getUpdatedItemsForSales = (existingItems, newItems) => {
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
    // // Remove items from the sale and update inventory after completing the inventory logic
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
exports.getUpdatedItemsForSales = getUpdatedItemsForSales;
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
const updateSalesById = async (salesId, salesBody) => {
    const sales = await (0, exports.findSalesById)(salesId);
    if (!sales)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Sales not found.');
    if ((0, common_1.stringifyObjectId)(salesBody.businessId) !== (0, common_1.stringifyObjectId)(sales.businessId))
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'You can only update your own sales.');
    const customer = await (0, customer_service_1.findCustomerById)(new mongoose_1.default.Types.ObjectId(salesBody.customerId));
    if (!customer)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Customer not found.');
    const copiedSalesBody = Object.assign({}, salesBody);
    const updatedPayments = (0, purchase_service_1.getUpdatedPayments)(sales.paymentInfo.payments, copiedSalesBody.paymentInfo.payments);
    const sanitizedItems = (await (0, item_service_1.sanitizeItemParams)(copiedSalesBody.items, false, true));
    const updatedItems = (0, exports.getUpdatedItemsForSales)(sales.items, sanitizedItems);
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(updatedPayments, updatedItems);
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
exports.updateSalesById = updateSalesById;
const deleteSales = async (querySalesId, businessId) => {
    const salesIds = (0, common_1.splitFromQuery)(querySalesId);
    const mappedSalesIds = salesIds.map((itemId) => new mongoose_1.default.Types.ObjectId(itemId));
    const matchQuery = {
        _id: { $in: mappedSalesIds },
    };
    if (businessId) {
        matchQuery.businessId = businessId;
    }
    await sales_model_1.default.deleteMany(matchQuery);
};
exports.deleteSales = deleteSales;
const addSalesPayment = async (salesId, paymentBody) => {
    var _a;
    const sales = await (0, exports.findSalesById)(salesId);
    if (!sales)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Sales not found.');
    if (sales.paymentInfo.status === enums_1.PaymentStatus.PAID)
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'The sales has already been fully paid.');
    const payment = Object.assign(Object.assign({}, paymentBody), { method: (_a = paymentBody === null || paymentBody === void 0 ? void 0 : paymentBody.method) !== null && _a !== void 0 ? _a : enums_1.PaymentMethod.CASH, _id: new mongoose_1.default.Types.ObjectId() });
    const updatedPayments = [...sales.paymentInfo.payments, ...[payment]];
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(updatedPayments, sales.items);
    sales.paymentInfo = updatedPaymentInfo;
    await sales.save();
    return sales;
};
exports.addSalesPayment = addSalesPayment;
const updateSalesPayment = async (salesId, paymentId, paymentBody) => {
    var _a;
    const sales = await (0, exports.findSalesById)(salesId);
    if (!sales)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Sales not found.');
    const payment = (0, common_1.findObjectFromArrayByField)(sales.paymentInfo.payments, paymentId, '_id');
    if (!payment)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Sales Payment not found.');
    Object.assign(payment, Object.assign(Object.assign({}, paymentBody), { method: (_a = paymentBody === null || paymentBody === void 0 ? void 0 : paymentBody.method) !== null && _a !== void 0 ? _a : enums_1.PaymentMethod.CASH }));
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(sales.paymentInfo.payments, sales.items);
    sales.paymentInfo = updatedPaymentInfo;
    await sales.save();
    return sales;
};
exports.updateSalesPayment = updateSalesPayment;
const removeSalesPayment = async (salesId, paymentId) => {
    const sales = await (0, exports.findSalesById)(salesId);
    if (!sales)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Sales not found.');
    const paymentIndex = (0, common_1.findIndexOfObjectFromArrayByField)(sales.paymentInfo.payments, paymentId, '_id');
    if (paymentIndex <= -1)
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Payment not found.');
    sales.paymentInfo.payments.splice(paymentIndex, 1);
    const updatedPaymentInfo = (0, exports.updatePaymentInfo)(sales.paymentInfo.payments, sales.items);
    sales.paymentInfo = updatedPaymentInfo;
    await sales.save();
    return sales;
};
exports.removeSalesPayment = removeSalesPayment;
//# sourceMappingURL=sales.service.js.map