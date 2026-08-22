import { Order, DeliveryOrder } from '../../types';

/**
 * Kandy branch seed data.
 * Ids are city-prefixed (KAN) so they stay globally unique across branches.
 * TODO: Kandy team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-kandy';
const MIN = 60 * 1000;
const now = Date.now();

export const kandyKitchenOrders: Order[] = [
  {
    id: '#ORD-KAN-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 03',
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 1 },
      { id: 'a2', name: 'Mashed Potatoes', quantity: 1 }
    ],
    stage: 'New',
    createdAt: '12:47 PM',
    createdAtTimestamp: now - 2 * MIN,
    waiter: 'Hasini Dias',
    specialNotes: 'No gravy on potatoes.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '12:47 PM',
    version: 1,
    history: [
      { id: 'h-kan-1', stage: 'New', timestamp: '12:47 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-KAN-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 07',
    items: [
      { id: 'm7', name: 'Veg Curry & Steamed Rice', quantity: 2 },
      { id: 'd4', name: 'Fresh Mango Juice', quantity: 2 }
    ],
    stage: 'Cooking',
    createdAt: '12:29 PM',
    createdAtTimestamp: now - 16 * MIN,
    waiter: 'Kavindu Cooray',
    chef: 'Chamath Silva',
    specialNotes: 'Medium spice.',
    lastUpdatedBy: 'Chamath Silva',
    lastUpdatedAt: '12:33 PM',
    version: 2,
    history: [
      { id: 'h-kan-2', stage: 'New', timestamp: '12:29 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'h-kan-3', stage: 'Cooking', timestamp: '12:33 PM', user: 'Chamath Silva', role: 'chef' }
    ]
  }
];

export const kandyDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-KAN-2001',
    branchId: BRANCH_ID,
    customerName: 'Chathura Alwis',
    address: '21 Peradeniya Road, Kandy',
    distanceKm: 3.8,
    items: [
      { id: 'm1', name: 'Chicken Fried Rice', quantity: 2 },
      { id: 'a1', name: 'Veg Spring Rolls', quantity: 1 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Cash',
    orderTotal: 31.5,
    etaMinutes: 35,
    createdAt: '1:06 PM',
    createdAtTimestamp: now - 4 * MIN,
    specialNotes: 'Second gate near the temple.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '1:06 PM',
    version: 1,
    history: [
      { id: 'dh-kan-1', stage: 'Preparing', timestamp: '1:06 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-KAN-2002',
    branchId: BRANCH_ID,
    customerName: 'Nethmi Rajapaksha',
    address: '5 Temple Street, Kandy',
    distanceKm: 6.2,
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'd2', name: 'Iced Tea', quantity: 2 }
    ],
    stage: 'Out for Delivery',
    rider: 'Tharindu Fonseka',
    paymentMethod: 'Online',
    orderTotal: 25.5,
    etaMinutes: 40,
    createdAt: '12:38 PM',
    createdAtTimestamp: now - 28 * MIN,
    specialNotes: 'Uphill — steep driveway.',
    lastUpdatedBy: 'Tharindu Fonseka',
    lastUpdatedAt: '1:00 PM',
    version: 3,
    history: [
      { id: 'dh-kan-2', stage: 'Preparing', timestamp: '12:38 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'dh-kan-3', stage: 'Ready for Pickup', timestamp: '12:50 PM', user: 'Priya Fernando', role: 'chef' },
      { id: 'dh-kan-4', stage: 'Out for Delivery', timestamp: '1:00 PM', user: 'Tharindu Fonseka', role: 'rider' }
    ]
  }
];
