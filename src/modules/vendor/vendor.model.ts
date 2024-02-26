import mongoose from 'mongoose';
import { RegistrationType } from '../../config/enums';
import { IVendorDoc, IVendorModel } from './vendor.interfaces';

const vendorSchema = new mongoose.Schema<IVendorDoc, IVendorModel>(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    registrationType: { type: String, enum: RegistrationType, default: RegistrationType.PAN },
    registrationNumber: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

vendorSchema.static(
  'isNameTaken',
  async function isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeVendorId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const vendor = await this.findOne({
      name,
      businessId,
      _id: {
        $ne: excludeVendorId,
      },
    });

    return !!vendor;
  }
);

const Vendor = mongoose.model<IVendorDoc, IVendorModel>('Vendor', vendorSchema);

export default Vendor;
