import mongoose, { Types } from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'category'
  seq: { type: Number, default: 0 },
});

// use existing compiled model if present to avoid OverwriteModelError
const CategoryCounter =
  (mongoose.models && (mongoose.models as any).CategoryCounter) ||
  mongoose.model('CategoryCounter', counterSchema);

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: { type: String, required: true },
  description: { type: String, required: false },
  products: [
    {
      // ensure this matches Product._id type; use String if Product uses string ids
      type: String,
      ref: 'Product',
      required: false,
      default: null,
    },
  ],
  create_by: {
    // change to String to match User._id (auto-increment string)
    type: String,
    required: false,
    ref: 'User',
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
});

categorySchema.pre('save', async function (next) {
  const doc: any = this;
  if (!doc.isNew) return next();
  if (doc._id) return next();

  try {
    const counter = await (CategoryCounter as any).findByIdAndUpdate(
      'category',
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

export const Category = mongoose.model('Category', categorySchema);
