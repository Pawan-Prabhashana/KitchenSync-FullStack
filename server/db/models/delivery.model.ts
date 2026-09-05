import mongoose, { Schema } from 'mongoose';
import { DeliveryOrder } from '../../models/types';

const cleanTransform = {
  virtuals: false,
  transform(_doc: unknown, ret: Record<string, unknown>) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
};

const OrderItemSchema = new Schema(
  { id: String, name: String, quantity: Number, notes: String },
  { _id: false }
);

const HistorySchema = new Schema(
  { id: String, stage: String, timestamp: String, user: String, role: String },
  { _id: false }
);

const DeliverySchema = new Schema<DeliveryOrder>(
  {
    id: { type: String, required: true, unique: true },
    branchId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    items: { type: [OrderItemSchema], default: [] },
    specialNotes: { type: String },
    stage: { type: String, required: true },
    rider: { type: String },
    paymentMethod: { type: String, required: true },
    orderTotal: { type: Number, required: true },
    etaMinutes: { type: Number, required: true },
    createdAt: { type: String, required: true },
    createdAtTimestamp: { type: Number, required: true },
    deliveredAt: { type: String },
    deliveredAtTimestamp: { type: Number },
    lastUpdatedBy: { type: String, required: true },
    lastUpdatedAt: { type: String, required: true },
    version: { type: Number, required: true },
    history: { type: [HistorySchema], default: [] }
  },
  { toJSON: cleanTransform, toObject: cleanTransform }
);

// { branchId, stage } — serves stats aggregation + stage-filtered queries.
DeliverySchema.index({ branchId: 1, stage: 1 });
// { branchId, createdAtTimestamp } — serves findAll(branchId) sorted newest-first.
DeliverySchema.index({ branchId: 1, createdAtTimestamp: -1 });

export const DeliveryModel =
  (mongoose.models.Delivery as mongoose.Model<DeliveryOrder>) ||
  mongoose.model<DeliveryOrder>('Delivery', DeliverySchema);
