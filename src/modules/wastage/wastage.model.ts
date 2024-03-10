import mongoose from 'mongoose';
import { IWastageDoc, IWastageModel } from './wastage.interfaces';
import { purchaseItemSchema } from '../purchase/purchase.model';

export const wastageSchema = new mongoose.Schema<IWastageDoc, IWastageModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    // employeeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Employee',
    // },
    date: { type: Date },
    description: { type: String },
    items: [purchaseItemSchema],
  },
  { timestamps: true }
);

const Wastage = mongoose.model<IWastageDoc, IWastageModel>('Wastage', wastageSchema);

export default Wastage;
