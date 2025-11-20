import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'product'
  seq: { type: Number, default: 0 },
});

const ProductCounter = mongoose.model('ProductCounter', counterSchema);

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    ref: 'Category',
  },
  create_by: {
    type: String,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
});

productSchema.pre('save', async function (next) {
  const doc: any = this;
  if (!doc.isNew) return next();
  if (doc._id) return next();

  try {
    const counter = await ProductCounter.findByIdAndUpdate(
      'product',
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    const seq = counter && (counter as any).seq ? (counter as any).seq : 1;
    doc._id = String(seq);
    return next();
  } catch (err) {
    return next(err as any);
  }
});

export const Product = mongoose.model('Product', productSchema);
