import mongoose from 'mongoose';
import { ISalesDoc, ISalesModel } from './sales.interfaces';
import { PaymentMethod, PaymentStatus } from '../../config/enums';
import { combinationItem } from '../item/item.model';

export const paymentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  amount: { type: Number },
  method: { type: String, enum: [...Object.values(PaymentMethod), null], default: null },
  date: { type: Date },
});

export const paymentInfoSchema = new mongoose.Schema(
  {
    status: { type: String, enum: PaymentStatus, default: PaymentStatus.NOT_PAID },
    string: { type: String },
    total: { type: Number },
    paid: { type: Number },
    remaining: { type: Number },
    returned: { type: Number },
    payments: [paymentSchema],
  },
  { _id: false }
);

export const salesItemSchema = new mongoose.Schema({
  ...combinationItem,
  price: Number,
});

const salesSchema = new mongoose.Schema<ISalesDoc, ISalesModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    paymentInfo: paymentInfoSchema,
    date: { type: Date },
    invoiceNumber: { type: String },
    items: [salesItemSchema],
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model<ISalesDoc, ISalesModel>('Sales', salesSchema);

export default Sales;
