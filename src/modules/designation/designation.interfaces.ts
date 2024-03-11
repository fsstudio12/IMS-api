import mongoose, { Document, Model } from 'mongoose';
import Actions from '../../config/actions';
import Resources from '../../config/resources';

export interface IResourceAction {
  resource: Resources;
  actions: Actions[];
}

export interface IDesignation {
  businessId: mongoose.Types.ObjectId;
  name: string;
  permissions: {
    [resource in Resources]: Actions[];
  };
}

export interface IDesignationDoc extends IDesignation, Document {}

export interface IDesignationModel extends Model<IDesignationDoc> {
  isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeDesignationId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

export type NewDesignation = Omit<IDesignation, 'businessId'>;
