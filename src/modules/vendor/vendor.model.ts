import mongoose from 'mongoose';
import { RegistrationType } from 'src/config/enums';

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
    registrationType: { type: String, enum: RegistrationType, default: RegistrationType.PAN },
    registrationNumber: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
