import mongoose, { Document, Model } from 'mongoose';
import { ICombinationItem } from '../item/item.interfaces';
import { IPayment, IPaymentInfo } from '../purchase/purchase.interfaces';

export interface ISales {
  businessId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  paymentInfo: IPaymentInfo;
  date: Date;
  invoiceNumber: string;
  items: ICombinationItem[];
}

export interface ISalesDoc extends ISales, Document {}

export interface ISalesModel extends Model<ISalesDoc> {}

export interface INewSales {
  businessId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  payment: IPayment;
  date: Date;
  invoiceNumber: string;
  items: ICombinationItem[];
}

export type NewSales = INewSales;

export type UpdateSales = ISales;
