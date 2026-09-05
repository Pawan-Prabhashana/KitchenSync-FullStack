import mongoose, { Schema } from 'mongoose';
import { StoredUser } from '../../models/types';

/** Strip Mongo internals so persisted docs serialise to the clean domain shape. */
const cleanTransform = {
  virtuals: false,
  transform(_doc: unknown, ret: Record<string, unknown>) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
};

const UserSchema = new Schema<StoredUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    // Emails are stored lowercased (seed + register), so a plain unique index is
    // effectively case-insensitive. `lowercase: true` normalises any stray input.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true },
    avatar: { type: String },
    passwordHash: { type: String, required: true }
  },
  { toJSON: cleanTransform, toObject: cleanTransform }
);

// Guard against model re-registration under tsx watch / repeated imports.
export const UserModel =
  (mongoose.models.User as mongoose.Model<StoredUser>) ||
  mongoose.model<StoredUser>('User', UserSchema);
