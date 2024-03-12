import mongoose from 'mongoose';
import { IDesignationDoc, IDesignationModel } from './designation.interfaces';
import Resource from '../../config/resources';
import Action from '../../config/actions';

const permissionsSchema: any = {};

Object.values(Resource).forEach((resource: Resource) => {
  permissionsSchema[resource] = { type: [String], enum: Action };
});

const designationSchema = new mongoose.Schema<IDesignationDoc, IDesignationModel>(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    permissions: permissionsSchema,
  },
  {
    timestamps: true,
  }
);

/**
 * Check if designation name is taken
 * @param {string} name - The designation's name
 * @param {ObjectId} [excludeDesignationId] - The id of the designation to be excluded
 * @returns {Promise<boolean>}
 */
designationSchema.static(
  'isNameTaken',
  async function isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeDesignationId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const designation = await this.findOne({
      name,
      businessId,
      _id: {
        $ne: excludeDesignationId,
      },
    });

    return !!designation;
  }
);

const Designation = mongoose.model<IDesignationDoc, IDesignationModel>('Designation', designationSchema);

export default Designation;
