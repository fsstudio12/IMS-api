import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
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

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUser = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified' | 'isVerified' | 'isBanned' | 'businessId'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | 'isVerified' | 'isBanned' | 'businessId'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
