import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IEmployee {
  businessId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isVerified: boolean;
  isBanned: boolean;
}

export interface IEmployeeDoc extends IEmployee, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IEmployeeModel extends Model<IEmployeeDoc> {
  isEmailTaken(email: string, excludeEmployeeId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateEmployee = Partial<IEmployee>;

export type NewRegisteredEmployee = Omit<IEmployee, 'role' | 'isEmailVerified' | 'isVerified' | 'isBanned' | 'businessId'>;

export type NewCreatedEmployee = Omit<IEmployee, 'isEmailVerified' | 'isVerified' | 'isBanned' | 'businessId'>;

export interface IEmployeeWithTokens {
  employee: IEmployeeDoc;
  tokens: AccessAndRefreshTokens;
}
