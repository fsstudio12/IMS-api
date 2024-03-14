import mongoose from 'mongoose';
import { IDepartmentDoc, IDepartmentModel } from './department.interfaces';
import Resource from '../../config/resources';
import Action from '../../config/actions';

const permissionsSchema: any = {};

Object.values(Resource).forEach((resource: Resource) => {
  permissionsSchema[resource] = { type: [String], enum: Action };
});

const departmentSchema = new mongoose.Schema<IDepartmentDoc, IDepartmentModel>(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, required: true },
    permissions: permissionsSchema,
  },
  {
    timestamps: true,
  }
);

/**
 * Check if department title is taken
 * @param {string} title - The department's title
 * @param {ObjectId} [excludeDepartmentId] - The id of the department to be excluded
 * @returns {Promise<boolean>}
 */
departmentSchema.static(
  'isTitleTaken',
  async function isTitleTaken(
    title: string,
    businessId: mongoose.Types.ObjectId,
    excludeDepartmentId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const department = await this.findOne({
      title,
      businessId,
      _id: {
        $ne: excludeDepartmentId,
      },
    });

    return !!department;
  }
);

const Department = mongoose.model<IDepartmentDoc, IDepartmentModel>('Department', departmentSchema);

export default Department;
