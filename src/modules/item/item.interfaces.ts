import mongoose, { Document, Model } from 'mongoose';
import { QuantityMetric } from '../../config/enums';
import { QueryResult } from '../paginate/paginate';

export interface ICombinationItem {
  _id: mongoose.Types.ObjectId;
  name?: string;
  quantity: number;
  quantityMetric: QuantityMetric;
  // [Symbol.iterator](): Iterator<[string, any]>;
}

export interface IITem {
  businessId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  quantityMetric: QuantityMetric;
  price: number | null;
  isSellable: boolean;
  isCombination: boolean;
  combinationItems: ICombinationItem[];
}

export interface IItemDoc extends IITem, Document {}

export interface IItemModel extends Model<IItemDoc> {
  isNameTaken(name: string, businessId: mongoose.Types.ObjectId, excludeItemId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateItem = Partial<IITem>;

export type NewItem = IITem;

export type ItemTableList = {
  _id: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  quantityMetric: QuantityMetric;
  combination: string[];
  foodCost: number;
  average: number;
  isSellable: boolean;
  isCombination: boolean;
  price: number | null;
  combinationItems: ICombinationItem[];
};
