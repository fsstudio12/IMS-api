import mongoose from 'mongoose';
import { PaymentMethod } from '../../config/enums';
import { IUtilityDoc, IUtilityModel } from './utility.interfaces';

export const utilityPaymentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  name: { type: String },
  amount: { type: Number },
  method: { type: String, enum: PaymentMethod },
  date: { type: Date },
  from: { type: Date },
  to: { type: Date },
});

const utilitySchema = new mongoose.Schema<IUtilityDoc, IUtilityModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    title: { type: String },
    payments: [utilityPaymentSchema],
  },
  { timestamps: true }
);

const Utility = mongoose.model<IUtilityDoc, IUtilityModel>('Utility', utilitySchema);

export default Utility;
