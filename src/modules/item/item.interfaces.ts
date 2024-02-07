import mongoose, { Document, Model } from 'mongoose';
import { QuantityMetric } from 'src/config/enums';
import { QueryResult } from '../paginate/paginate';

export interface ICombinationItem {
  _id: mongoose.Types.ObjectId;
  quantity: number;
  quantityMetric: QuantityMetric;
  price: number;
}

export interface IITem {
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
  isNameTaken(name: string, excludeBusinessId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateItemBody = Partial<IITem>;

export type NewCreatedItem = IITem;
