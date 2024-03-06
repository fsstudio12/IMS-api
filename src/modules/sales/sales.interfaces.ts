import mongoose, { Document, Model } from 'mongoose';
import { ICombinationItem } from '../item/item.interfaces';
import { PaymentMethod, PaymentStatus } from '../../config/enums';

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  name?: string;
  amount: number;
  method?: PaymentMethod;
  date: Date;
}

export interface IPaymentInfo {
  status: PaymentStatus;
  total: number;
  paid: number;
  remaining: number;
  returned: number;
  payments: IPayment[];
}

export interface ISalesItem extends ICombinationItem {
  price: number;
}

export interface ISales {
  businessId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  paymentInfo: IPaymentInfo;
  date: Date;
  invoiceNumber: string;
  items: ISalesItem[];
}

export interface ISalesDoc extends ISales, Document {}

export interface ISalesModel extends Model<ISalesDoc> {}

export interface INewSales {
  businessId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  payment: IPayment;
  date: Date;
  invoiceNumber: string;
  items: ISalesItem[];
}

export type NewSales = INewSales;

export type UpdateSales = ISales;
