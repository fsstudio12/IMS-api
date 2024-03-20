import mongoose from 'mongoose';
import { paymentSchema } from '../sales/sales.model';
import { IUtilityPaymentDoc, IUtilityPaymentModel } from './utilityPayment.interfaces';

export const eachUtilityPaymentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  payments: [paymentSchema],
});

const utilityPaymentSchema = new mongoose.Schema<IUtilityPaymentDoc, IUtilityPaymentModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    title: { type: String },
    date: { type: Date },
    from: { type: Date },
    to: { type: Date },
    utilities: [eachUtilityPaymentSchema],
  },
  { timestamps: true }
);

const UtilityPayment = mongoose.model<IUtilityPaymentDoc, IUtilityPaymentModel>('UtilityPayment', utilityPaymentSchema);

export default UtilityPayment;
