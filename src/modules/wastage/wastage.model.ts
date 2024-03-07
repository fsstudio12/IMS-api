import mongoose from 'mongoose';
import { IWastageDoc, IWastageModel } from './wastage.interfaces';
import { combinationItemSchema } from '../item/item.model';

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
    items: [combinationItemSchema],
  },
  { timestamps: true }
);

const Wastage = mongoose.model<IWastageDoc, IWastageModel>('Wastage', wastageSchema);

export default Wastage;
