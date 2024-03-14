import mongoose, { Document, Model } from 'mongoose';
import Actions from '../../config/actions';
import Resources from '../../config/resources';

export interface IResourceAction {
  resource: Resources;
  actions: Actions[];
}

export interface IDepartment {
  businessId: mongoose.Types.ObjectId;
  title: string;
  permissions: {
    [resource in Resources]: Actions[];
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
