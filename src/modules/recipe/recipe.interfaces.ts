import mongoose, { Document, Model } from 'mongoose';
import { QuantityMetric } from '../../config/enums';
import { ICombinationItem } from '../item/item.interfaces';

export interface IRecipe {
  businessId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  quantityMetric: QuantityMetric;
  price: number;
  combinationItems: ICombinationItem[];
}

export interface IRecipeDoc extends IRecipe, Document {}

export interface IRecipeModel extends Model<IRecipeDoc> {
  isNameTaken(name: string, businessId: mongoose.Types.ObjectId, excludeItemId?: mongoose.Types.ObjectId): Promise<boolean>;
}

export type UpdateRecipe = Partial<IRecipe>;

export type NewRecipe = IRecipe;
