import mongoose from 'mongoose';
import validator from 'validator';
import { IBusinessDoc, IBusinessModel } from './business.interfaces';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';

const businessSchema = new mongoose.Schema<IBusinessDoc, IBusinessModel>(
  {
    name: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

businessSchema.static(
  'isEmailTaken',
  async function (email: string, excludeBusinessId: mongoose.ObjectId): Promise<boolean> {
    const business = await this.findOne({ email, _id: { $ne: excludeBusinessId } });
    return !!business;
  }
);

businessSchema.static('isNameTaken', async function (name: string, excludeBusinessId: mongoose.ObjectId): Promise<boolean> {
  const business = await this.findOne({ name, _id: { $ne: excludeBusinessId } });
  return !!business;
});

businessSchema.plugin(toJSON);
businessSchema.plugin(paginate);

const Business = mongoose.model<IBusinessDoc, IBusinessModel>('Business', businessSchema);

export default Business;
