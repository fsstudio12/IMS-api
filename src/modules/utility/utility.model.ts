import mongoose from 'mongoose';
import { IUtilityDoc, IUtilityModel } from './utility.interfaces';

const utilitySchema = new mongoose.Schema<IUtilityDoc, IUtilityModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    title: { type: String },
  },
  { timestamps: true }
);

const Utility = mongoose.model<IUtilityDoc, IUtilityModel>('Utility', utilitySchema);

export default Utility;
