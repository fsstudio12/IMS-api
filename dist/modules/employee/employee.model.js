"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const toJSON_1 = __importDefault(require("../toJSON/toJSON"));
const paginate_1 = __importDefault(require("../paginate/paginate"));
const enums_1 = require("../../config/enums");
const employeeSchema = new mongoose_1.default.Schema({
    businessId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    phone: { type: String },
    address: { type: String },
    departmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
    },
    enrollmentType: { type: String, enum: enums_1.EnrollmentType },
    paySchedule: { type: String, enum: enums_1.PaySchedule },
    payStartAt: { type: Date },
    wageType: { type: String, enum: enums_1.WageType },
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
        enum: enums_1.Role,
        default: enums_1.Role.EMPLOYEE,
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
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
employeeSchema.plugin(toJSON_1.default);
employeeSchema.plugin(paginate_1.default);
/**
 * Check if email is taken
 * @param {string} email - The employee's email
 * @param {ObjectId} [excludeEmployeeId] - The id of the employee to be excluded
 * @returns {Promise<boolean>}
 */
employeeSchema.static('isEmailTaken', async function (email, excludeEmployeeId) {
    const employee = await this.findOne({ email, _id: { $ne: excludeEmployeeId } });
    return !!employee;
});
/**
 * Check if password matches the employee's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
employeeSchema.method('isPasswordMatch', async function (password) {
    const employee = this;
    return bcryptjs_1.default.compare(password, employee.password);
});
employeeSchema.pre('save', async function (next) {
    const employee = this;
    if (employee.isModified('password')) {
        employee.password = await bcryptjs_1.default.hash(employee.password, 8);
    }
    next();
});
const Employee = mongoose_1.default.model('Employee', employeeSchema);
exports.default = Employee;
//# sourceMappingURL=employee.model.js.map