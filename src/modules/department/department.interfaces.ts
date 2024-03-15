import mongoose, { Document, Model } from 'mongoose';
import Action from '../../config/actions';
import Resource from '../../config/resources';

export interface IResourceAction {
  resource: Resource;
  actions: Action[];
}

export interface IDepartment {
  businessId: mongoose.Types.ObjectId;
  title: string;
  permissions: {
    [resource in Resource]: Action[];
  };
}

export interface IDepartmentDoc extends IDepartment, Document {}

export interface IDepartmentModel extends Model<IDepartmentDoc> {
  isTitleTaken(
    title: string,
    businessId: mongoose.Types.ObjectId,
    excludeDepartmentId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

export type NewDepartment = Omit<IDepartment, 'businessId'>;
