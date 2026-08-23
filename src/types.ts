export type Role = 'waiter' | 'chef' | 'admin' | 'rider';

export type Stage = 'New' | 'Cooking' | 'Ready' | 'Served';

/** Which board the user is currently working in. */
export type BoardType = 'kitchen' | 'delivery';

/** A restaurant branch (location). Kitchen + delivery data is scoped per branch. */
export interface Branch {
  id: string;
  name: string;
  city: string;
}

/** Column stages for the Delivery board (kept separate from kitchen Stage). */
export type DeliveryStage = 'Preparing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered';

export type PaymentMethod = 'Cash' | 'Card' | 'Online';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  email: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface OrderHistoryItem {
  id: string;
  stage: Stage;
  timestamp: string;
  user: string;
  role: Role;
}

export interface Order {
  id: string;
  branchId: string;
  tableNumber: string;
  items: OrderItem[];
  specialNotes?: string;
  stage: Stage;
  waiter: string;
  chef?: string;
  createdAt: string;
  createdAtTimestamp: number;
  servedAt?: string;
  servedAtTimestamp?: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  version: number;
  history: OrderHistoryItem[];
}

export interface DeliveryHistoryItem {
  id: string;
  stage: DeliveryStage;
  timestamp: string;
  user: string;
  role: Role;
}

/**
 * A delivery-side order. Mirrors {@link Order} but models the doorstep-delivery
 * domain (customer, address, rider, ETA, payment). Carries the same
 * version / lastUpdatedBy / lastUpdatedAt / history fields so the conflict guard
 * and history timeline work identically across both boards.
 */
export interface DeliveryOrder {
  id: string;
  branchId: string;
  customerName: string;
  address: string;
  distanceKm: number;
  items: OrderItem[];
  specialNotes?: string;
  stage: DeliveryStage;
  rider?: string;
  paymentMethod: PaymentMethod;
  orderTotal: number;
  /** Target delivery window (minutes from order creation) — drives the ETA/lateness timer. */
  etaMinutes: number;
  createdAt: string;
  createdAtTimestamp: number;
  deliveredAt?: string;
  deliveredAtTimestamp?: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  version: number;
  history: DeliveryHistoryItem[];
}

export interface FilterOptions {
  chef: string;
  table: string;
  search: string;
  viewMode: 'all' | 'mine';
}

export interface UndoMove {
  orderId: string;
  fromStage: Stage;
  toStage: Stage;
  orderStateBefore: Order;
  timestamp: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Mains' | 'Appetizers' | 'Drinks' | 'Desserts';
  price: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ConflictNotification {
  orderId: string;
  tableNumber: string;
  updatedBy: string;
  updatedAt: string;
}

/**
 * Lightweight conflict payload surfaced by the optimistic-concurrency guard.
 * Shared by both boards; wiring to a real Socket.io `order:updated` event later
 * is a drop-in replacement for the demo "simulate teammate edit" trigger.
 */
export interface ConflictInfo {
  orderId: string;
  updatedBy: string;
  updatedAt: string;
}

/** Minimal shape the conflict guard needs from any versioned entity. */
export interface Versioned {
  id: string;
  version: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}
