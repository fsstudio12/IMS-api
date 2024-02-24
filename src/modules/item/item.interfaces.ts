import mongoose, { Document, Model } from 'mongoose';
import { QuantityMetric } from 'src/config/enums';
import { QueryResult } from '../paginate/paginate';

export interface ICombinationItem extends Document {
  name: string;
  quantity: number;
  quantityMetric: QuantityMetric;
  price: number;
}

export interface IITem {
  businessId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  quantityMetric: QuantityMetric;
  price: number;
  isSellable: boolean;
  isCombination: boolean;
  combinationItems: ICombinationItem[];
}

export interface IItemDoc extends IITem, Document {}

export interface IItemModel extends Model<IItemDoc> {
  isNameTaken(name: string, businessId: mongoose.Types.ObjectId, excludeItemId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateItemBody = Partial<IITem>;

export type NewItem = IITem;
