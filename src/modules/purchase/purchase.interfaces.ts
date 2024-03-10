import mongoose, { Document, Model } from 'mongoose';
import { ICombinationItem } from '../item/item.interfaces';
import { PaymentMethod, PaymentStatus } from '../../config/enums';

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  title?: string;
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

export interface IPurchase {
  businessId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  paymentInfo: IPaymentInfo;
  date: Date;
  invoiceNumber: string;
  items: ICombinationItem[];
}

export interface IPurchaseDoc extends IPurchase, Document {}

export interface IPurchaseModel extends Model<IPurchaseDoc> {}

export interface INewPurchase {
  businessId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  payment: IPayment;
  date: Date;
  invoiceNumber: string;
  items: ICombinationItem[];
}

export type NewPurchase = INewPurchase;

export type UpdatePurchase = IPurchase;
