import mongoose from 'mongoose';
import { CustomerType, RegistrationType } from '../../config/enums';
import { ICustomerDoc, ICustomerModel } from './customer.interfaces';

export const addressSchema = new mongoose.Schema(
  {
    location: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
  },
  {
    _id: false,
  }
);

const customerSchema = new mongoose.Schema<ICustomerDoc, ICustomerModel>(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    image: { type: String },
    type: { type: String, enum: CustomerType, default: CustomerType.INDIVIDUAL },
    registrationType: { type: String, enum: [...Object.values(RegistrationType), null], default: null },
    registrationNumber: { type: String, default: null },
    address: addressSchema,
  },
  { timestamps: true }
);

customerSchema.static(
  'isNameTaken',
  async function isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeCustomerId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const customer = await this.findOne({
      name,
      businessId,
      _id: {
        $ne: excludeCustomerId,
      },
    });

    return !!customer;
  }
);

customerSchema.static(
  'isPhoneTaken',
  async function isPhoneTaken(
    phone: string,
    businessId: mongoose.Types.ObjectId,
    excludeCustomerId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const customer = await this.findOne({
      phone,
      businessId,
      _id: {
        $ne: excludeCustomerId,
      },
    });

    return !!customer;
  }
);

const Customer = mongoose.model<ICustomerDoc, ICustomerModel>('Customer', customerSchema);

export default Customer;
