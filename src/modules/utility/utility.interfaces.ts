import mongoose, { Document, Model } from 'mongoose';
import { PaymentMethod } from 'src/config/enums';

export interface IUtilityPayment {
  _id: mongoose.Types.ObjectId;
  title?: string;
  name?: string;
  amount: number;
  method?: PaymentMethod;
  date: Date;
  from: Date;
  to: Date;
}

export interface IUtility {
  businessId: mongoose.Types.ObjectId;
  title: string;
  payments: IUtilityPayment[];
}

export interface IUtilityDoc extends IUtility, Document {}

export interface IUtilityModel extends Model<IUtilityDoc> {}

export type NewUtility = {
  businessId: mongoose.Types.ObjectId;
  title: string;
};

export type UpdateUtility = Omit<NewUtility, 'businessId'>;
