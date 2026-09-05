import mongoose, { Schema } from 'mongoose';
import { Order } from '../../models/types';

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

const OrderSchema = new Schema<Order>(
  {
    id: { type: String, required: true, unique: true },
    branchId: { type: String, required: true, index: true },
    tableNumber: { type: String, required: true },
    items: { type: [OrderItemSchema], default: [] },
    specialNotes: { type: String },
    stage: { type: String, required: true },
    waiter: { type: String, required: true },
    chef: { type: String },
    createdAt: { type: String, required: true },
    createdAtTimestamp: { type: Number, required: true },
    servedAt: { type: String },
    servedAtTimestamp: { type: Number },
    lastUpdatedBy: { type: String, required: true },
    lastUpdatedAt: { type: String, required: true },
    version: { type: Number, required: true },
    history: { type: [HistorySchema], default: [] }
  },
  { toJSON: cleanTransform, toObject: cleanTransform }
);

// Compound indexes:
// { branchId, stage } — serves the stats aggregation ($match branchId, $group by
//   stage) and stage-filtered board queries. (`stage` is this domain's "status".)
OrderSchema.index({ branchId: 1, stage: 1 });
// { branchId, createdAtTimestamp } — serves findAll(branchId) sorted newest-first.
//   (`createdAtTimestamp` is the sortable numeric form of createdAt.)
OrderSchema.index({ branchId: 1, createdAtTimestamp: -1 });

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>('Order', OrderSchema);
