import mongoose, { Document, Model } from 'mongoose';
import { RegistrationType } from 'src/config/enums';
import { QueryResult } from '../paginate/paginate';

export interface IVendor {
  name: string;
  email: string;
  phone: string;
  registrationType: RegistrationType;
  registrationNumber: string;
  address: string;
}

export interface IVendorDoc extends IVendor, Document {}

export interface IVendorModel extends Model<IVendorDoc> {
  isNameTaken(name: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateVendorBody = Partial<IVendor>;

export type NewVendor = IVendor;
