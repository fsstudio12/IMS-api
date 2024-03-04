import mongoose, { Document, Model } from 'mongoose';
import { CustomerType, RegistrationType } from '../../config/enums';
import { QueryResult } from '../paginate/paginate';

export interface IAddress {
  location: string;
  city: string;
  region: string;
  country: string;
}

export interface ICustomer {
  businessId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  type: CustomerType;
  registrationType: RegistrationType | null;
  registrationNumber: string;
  address: IAddress;
}

export interface ICustomerDoc extends ICustomer, Document {}

export interface ICustomerModel extends Model<ICustomerDoc> {
  isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeCustomerId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  isPhoneTaken(
    phone: string,
    businessI: mongoose.Types.ObjectId,
    excludeCustomerId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCustomer = Partial<ICustomer>;

export type NewCustomer = ICustomer;
