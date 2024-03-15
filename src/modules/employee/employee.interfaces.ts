import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';
import { EnrollmentType, PaySchedule, Role, WageType } from '../../config/enums';
import Resource from '../../config/resources';
import Action from '../../config/actions';

export interface IEmployee {
  businessId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;

  departmentId: mongoose.Types.ObjectId;
  enrollmentType: EnrollmentType;
  paySchedule: PaySchedule;
  payStartAt: Date;
  wageType: WageType;
  salary: number;
  joinedAt: Date;
  contractStart: Date;
  contractEnd: Date;

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

export type CreateEmployeePayload = Omit<IEmployee, 'isEmailVerified' | 'isVerified' | 'isBanned' | 'role' | 'businessId'>;

export type EmployeePayloadWithFullInfo = Omit<IEmployee, 'isEmailVerified' | 'isVerified' | 'isBanned'> & {
  departmentId: string;
};

export type UpdateEmployeePayload = Partial<IEmployee>;

export type RegisterEmployeePayload = Pick<IEmployee, 'name' | 'email' | 'phone' | 'password'>;

export type CreateEmployeePayloadWithPartialInfo = Pick<
  IEmployee,
  'name' | 'email' | 'phone' | 'password' | 'businessId' | 'departmentId'
>;

export interface IEmployeeWithTokens {
  employee: IEmployeeDoc;
  tokens: AccessAndRefreshTokens;
}

export interface IEmployeeForAuth {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isEmailVerified: boolean;
  isVerified: boolean;
  isBanned: boolean;
  department: {
    _id: mongoose.Types.ObjectId;
    title: string;
    permissions: {
      [resource in Resource]: Action[];
    };
  };
  business: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
}
