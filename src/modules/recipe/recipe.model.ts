import mongoose from 'mongoose';
import { QuantityMetric } from '../../config/enums';
import { combinationItemSchema } from '../item/item.model';
import { IRecipeDoc, IRecipeModel } from './recipe.interfaces';

const recipeSchema = new mongoose.Schema<IRecipeDoc, IRecipeModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    name: { type: String, required: true },
    quantity: { type: Number },
    quantityMetric: { type: String, enum: QuantityMetric, default: QuantityMetric.GRAM },
    price: { type: Number },
    combinationItems: [combinationItemSchema],
  },
  {
    timestamps: true,
  }
);

recipeSchema.static(
  'isNameTaken',
  async function isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeRecipeId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const recipe = await this.findOne({
      name,
      businessId,
      _id: {
        $ne: excludeRecipeId,
      },
    });

    return !!recipe;
  }
);

const Recipe = mongoose.model<IRecipeDoc, IRecipeModel>('Recipe', recipeSchema);

export default Recipe;
