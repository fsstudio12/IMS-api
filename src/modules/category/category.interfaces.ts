import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ICategory {
  name: string;
  businessId: mongoose.Types.ObjectId;
}

export interface ICategoryDoc extends ICategory, Document {}

export interface ICategoryModel extends Model<ICategoryDoc> {
  isNameTaken(name: string, excludeCategoryId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCategoryBody = Partial<ICategory>;

export type NewCategory = Omit<ICategory, 'businessId'>;
