import mongoose, { Document, Model } from 'mongoose';

export interface IUtility {
  businessId: mongoose.Types.ObjectId;
  title: string;
}

export interface IUtilityDoc extends IUtility, Document {}

export interface IUtilityModel extends Model<IUtilityDoc> {}

export type NewUtility = {
  businessId: mongoose.Types.ObjectId;
  title: string;
};

export type UpdateUtility = Omit<NewUtility, 'businessId'>;
