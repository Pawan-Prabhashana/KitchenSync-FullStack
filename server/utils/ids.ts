/**
 * ID generation. Kitchen/delivery order ids keep the existing frontend style
 * (`#ORD-1234` / `#DEL-2345`) so seeded data and newly created records look
 * identical across both tiers.
 */
export const makeOrderId = (): string => `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

export const makeDeliveryId = (): string => `#DEL-${Math.floor(2000 + Math.random() * 9000)}`;

export const makeUserId = (): string => `u_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const makeHistoryId = (prefix = 'h'): string =>
  `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
