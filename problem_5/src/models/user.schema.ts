import mongoose from 'mongoose';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. 'user'
  seq: { type: Number, default: 0 },
});

const UserCounter = mongoose.model('UserCounter', counterSchema);

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    // default removed; will be set in pre-save hook
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
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

// Auto-increment _id for new users (stored as string)
userSchema.pre('save', async function (next) {
  // use function() to access this
  const doc: any = this;
  if (!doc.isNew) return next();
  if (doc._id) return next(); // if already set, don't override

  try {
    const counter = await UserCounter.findByIdAndUpdate(
      'user',
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    // counter.seq should exist; fall back to 1 if not
    const seq = counter && (counter as any).seq ? (counter as any).seq : 1;
    doc._id = String(seq);
    return next();
  } catch (err) {
    return next(err as any);
  }
});

export const User = mongoose.model('User', userSchema);
