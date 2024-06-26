import mongoose from 'mongoose';
import { ICategoryDoc, ICategoryModel } from './category.interfaces';
import { toJSON } from '../toJSON';

const categorySchema = new mongoose.Schema<ICategoryDoc, ICategoryModel>(
  {
    name: { type: String, required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if category name is taken
 * @param {string} name - The category's name
 * @param {ObjectId} [excludeUserId] - The id of the category to be excluded
 * @returns {Promise<boolean>}
 */
categorySchema.static('isNameTaken', async function (name: string, excludeCategoryId: mongoose.ObjectId): Promise<boolean> {
  const category = await this.findOne({ name, _id: { $ne: excludeCategoryId } });
  return !!category;
});

categorySchema.plugin(toJSON);

const Category = mongoose.model<ICategoryDoc, ICategoryModel>('Category', categorySchema);

export default Category;
