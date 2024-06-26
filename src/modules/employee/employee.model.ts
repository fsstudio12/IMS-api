import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IEmployeeDoc, IEmployeeModel } from './employee.interfaces';
import { EnrollmentType, PaySchedule, WageType, Role } from '../../config/enums';

const employeeSchema = new mongoose.Schema<IEmployeeDoc, IEmployeeModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
    phone: { type: String },
    address: { type: String },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    enrollmentType: { type: String, enum: EnrollmentType },
    paySchedule: { type: String, enum: PaySchedule },
    payStartAt: { type: Date },
    wageType: { type: String, enum: WageType },
    salary: { type: Number },
    joinedAt: { type: Date },
    contractStart: { type: Date },
    contractEnd: { type: Date },

    password: {
      type: String,
      required: true,
      trim: true,
      // minlength: 8,
      // validate(value: string) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error('Password must contain at least one letter and one number');
      //   }
      // },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: Role,
      default: Role.EMPLOYEE,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The employee's email
 * @param {ObjectId} [excludeEmployeeId] - The id of the employee to be excluded
 * @returns {Promise<boolean>}
 */
employeeSchema.static(
  'isEmailTaken',
  async function (email: string, excludeEmployeeId: mongoose.ObjectId): Promise<boolean> {
    const employee = await this.findOne({ email, _id: { $ne: excludeEmployeeId } });
    return !!employee;
  }
);

/**
 * Check if password matches the employee's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
employeeSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const employee = this;
  return bcrypt.compare(password, employee.password);
});

employeeSchema.pre('save', async function (next) {
  const employee = this;
  if (employee.isModified('password')) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});

const Employee = mongoose.model<IEmployeeDoc, IEmployeeModel>('Employee', employeeSchema);

export default Employee;
