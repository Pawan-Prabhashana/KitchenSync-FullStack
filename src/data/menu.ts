import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Chicken Fried Rice', category: 'Mains', price: 12.50 },
  { id: 'm2', name: 'Grilled Chicken', category: 'Mains', price: 16.00 },
  { id: 'm3', name: 'BBQ Chicken Pizza', category: 'Mains', price: 18.50 },
  { id: 'm4', name: 'Seafood Pasta', category: 'Mains', price: 19.00 },
  { id: 'm5', name: 'Beef Burger', category: 'Mains', price: 14.50 },
  { id: 'm6', name: 'Fish & Chips', category: 'Mains', price: 15.00 },
  { id: 'm7', name: 'Veg Curry & Steamed Rice', category: 'Mains', price: 11.50 },
  { id: 'm8', name: 'Chicken Wrap', category: 'Mains', price: 10.50 },
  { id: 'm9', name: 'Cheese Burger', category: 'Mains', price: 13.00 },
  { id: 'm10', name: 'Chicken Sandwich', category: 'Mains', price: 9.50 },

  { id: 'a1', name: 'Veg Spring Rolls', category: 'Appetizers', price: 6.50 },
  { id: 'a2', name: 'Mashed Potatoes', category: 'Appetizers', price: 5.00 },
  { id: 'a3', name: 'French Fries', category: 'Appetizers', price: 4.50 },
  { id: 'a4', name: 'Garlic Bread', category: 'Appetizers', price: 4.00 },
  { id: 'a5', name: 'Tartar Sauce', category: 'Appetizers', price: 1.50 },
  { id: 'a6', name: 'Garden Salad', category: 'Appetizers', price: 7.00 },

  { id: 'd1', name: 'Coke', category: 'Drinks', price: 3.00 },
  { id: 'd2', name: 'Iced Tea', category: 'Drinks', price: 3.50 },
  { id: 'd3', name: 'Lemonade', category: 'Drinks', price: 4.00 },
  { id: 'd4', name: 'Fresh Mango Juice', category: 'Drinks', price: 4.50 },

  { id: 'sw1', name: 'Chocolate Lava Cake', category: 'Desserts', price: 8.00 },
  { id: 'sw2', name: 'Vanilla Ice Cream', category: 'Desserts', price: 4.50 }
];

export const TABLES = [
  'Table 01', 'Table 02', 'Table 03', 'Table 04', 'Table 05',
  'Table 06', 'Table 07', 'Table 08', 'Table 09', 'Table 10',
  'Table 11', 'Table 12', 'Table 13', 'Table 14', 'Table 15',
  'Table 16', 'Table 17', 'Table 18', 'Table 19', 'Table 20'
];

// Avatars are rendered by <Avatar/> from initials — no external image URLs.
export const DEMO_USERS = [
  { id: 'u1', name: 'Priya Fernando', role: 'chef' as const, email: 'priya@kitchensync.com' },
  { id: 'u2', name: 'Nuwan Perera', role: 'chef' as const, email: 'nuwan@kitchensync.com' },
  { id: 'u3', name: 'Chamath Silva', role: 'chef' as const, email: 'chamath@kitchensync.com' },
  { id: 'u4', name: 'Nimal Jayasuriya', role: 'waiter' as const, email: 'nimal@kitchensync.com' },
  { id: 'u5', name: 'Hasini Dias', role: 'waiter' as const, email: 'hasini@kitchensync.com' },
  { id: 'u6', name: 'Kavindu Cooray', role: 'waiter' as const, email: 'kavindu@kitchensync.com' }
];

/** Delivery-side staff — riders who pick up and drop off orders. */
export const DEMO_RIDERS = [
  { id: 'r1', name: 'Sanjaya Bandara', role: 'rider' as const, email: 'sanjaya@kitchensync.com' },
  { id: 'r2', name: 'Dilan Rathnayake', role: 'rider' as const, email: 'dilan@kitchensync.com' },
  { id: 'r3', name: 'Tharindu Fonseka', role: 'rider' as const, email: 'tharindu@kitchensync.com' },
  { id: 'r4', name: 'Ishara Gunawardena', role: 'rider' as const, email: 'ishara@kitchensync.com' }
];

export const PAYMENT_METHODS: Array<'Cash' | 'Card' | 'Online'> = ['Cash', 'Card', 'Online'];
