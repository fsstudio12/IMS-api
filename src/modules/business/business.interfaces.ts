import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IBusiness {
  name: string;
  email: string;
}

export interface IBusinessDoc extends IBusiness, Document {}

export interface IBusinessModel extends Model<IBusinessDoc> {
  isNameTaken(name: string, excludeBusinessId?: mongoose.Types.ObjectId): Promise<boolean>;
  isEmailTaken(email: string, excludeBusinessId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateBusinessBody = Partial<IBusiness>;

export type NewBusiness = IBusiness;
