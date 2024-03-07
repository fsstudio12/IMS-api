import mongoose, { Document, Model } from 'mongoose';
import { ICombinationItem } from '../item/item.interfaces';

export interface IWastage {
  businessId: mongoose.Types.ObjectId;
  // employeeId: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  items: ICombinationItem[];
}

export interface IWastageDoc extends IWastage, Document {}

export interface IWastageModel extends Model<IWastageDoc> {}

export type NewWastage = Omit<IWastage, 'businessId'>;

export type UpdateWastage = Omit<IWastage, 'businessId'>;
