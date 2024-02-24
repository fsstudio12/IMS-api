import mongoose from 'mongoose';
import { QuantityMetric } from 'src/config/enums';
import { IItemDoc, IItemModel } from './item.interfaces';

const combinationItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  quantity: { type: Number },
  quantityMetric: { type: String, enum: QuantityMetric, default: QuantityMetric.GRAM },
  price: { type: Number },
});

const itemSchema = new mongoose.Schema<IItemDoc, IItemModel>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
    name: { type: String, required: true },
    quantity: { type: Number },
    quantityMetric: { type: String, enum: QuantityMetric, default: QuantityMetric.GRAM },
    price: { type: Number },
    isSellable: { type: Boolean, default: true },
    isCombination: { type: Boolean, default: false },
    combinationItems: [combinationItemSchema],
  },
  {
    timestamps: true,
  }
);

itemSchema.static(
  'isNameTaken',
  async function isNameTaken(
    name: string,
    businessId: mongoose.Types.ObjectId,
    excludeItemId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const item = await this.findOne({
      name,
      businessId,
      _id: {
        $ne: excludeItemId,
      },
    });

    return !!item;
  }
);

const Item = mongoose.model<IItemDoc, IItemModel>('Item', itemSchema);

export default Item;
