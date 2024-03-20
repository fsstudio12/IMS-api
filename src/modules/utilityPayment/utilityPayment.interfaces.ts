import mongoose, { Document, Model } from 'mongoose';
import { IPayment } from '../purchase/purchase.interfaces';

export interface IEachUtilityPayment {
  _id: mongoose.Types.ObjectId;
  title: string;
  payments: IPayment[];
}

export interface IUtilityPayment {
  businessId: mongoose.Types.ObjectId;
  title?: string;
  date: Date;
  from: Date;
  to: Date;
  utilities: IEachUtilityPayment[];
}

export interface IUtilityPaymentDoc extends IUtilityPayment, Document {}

export interface IUtilityPaymentModel extends Model<IUtilityPaymentDoc> {}
