import { Order, DeliveryOrder } from '../../types';

/**
 * Galle branch seed data.
 * Ids are city-prefixed (GAL) so they stay globally unique across branches.
 * TODO: Galle team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-galle';
const MIN = 60 * 1000;
const now = Date.now();

export const galleKitchenOrders: Order[] = [
  {
    id: '#ORD-GAL-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 02',
    items: [
      { id: 'm6', name: 'Fish & Chips', quantity: 2 },
      { id: 'd3', name: 'Lemonade', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:45 PM',
    createdAtTimestamp: now - 3 * MIN,
    waiter: 'Kavindu Cooray',
    specialNotes: 'Extra lemon wedges please.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '12:45 PM',
    version: 1,
    history: [
      { id: 'h-gal-1', stage: 'New', timestamp: '12:45 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-GAL-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 06',
    items: [
      { id: 'm4', name: 'Seafood Pasta', quantity: 1 },
      { id: 'a4', name: 'Garlic Bread', quantity: 1 }
    ],
    stage: 'Cooking',
    createdAt: '12:33 PM',
    createdAtTimestamp: now - 14 * MIN,
    waiter: 'Nimal Jayasuriya',
    chef: 'Nuwan Perera',
    specialNotes: 'Light on the chilli.',
    lastUpdatedBy: 'Nuwan Perera',
    lastUpdatedAt: '12:37 PM',
    version: 2,
    history: [
      { id: 'h-gal-2', stage: 'New', timestamp: '12:33 PM', user: 'Nimal Jayasuriya', role: 'waiter' },
      { id: 'h-gal-3', stage: 'Cooking', timestamp: '12:37 PM', user: 'Nuwan Perera', role: 'chef' }
    ]
  }
];

export const galleDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-GAL-2001',
    branchId: BRANCH_ID,
    customerName: 'Sachini Peris',
    address: '12 Lighthouse Street, Galle Fort',
    distanceKm: 2.6,
    items: [
      { id: 'm4', name: 'Seafood Pasta', quantity: 1 },
      { id: 'sw1', name: 'Chocolate Lava Cake', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Card',
    orderTotal: 35.0,
    etaMinutes: 30,
    createdAt: '1:04 PM',
    createdAtTimestamp: now - 5 * MIN,
    specialNotes: 'Leave dessert boxes upright.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '1:04 PM',
    version: 1,
    history: [
      { id: 'dh-gal-1', stage: 'Preparing', timestamp: '1:04 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-GAL-2002',
    branchId: BRANCH_ID,
    customerName: 'Menaka Herath',
    address: '88 Pedlar Street, Galle',
    distanceKm: 4.4,
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 1 },
      { id: 'a6', name: 'Garden Salad', quantity: 1 }
    ],
    stage: 'Out for Delivery',
    rider: 'Dilan Rathnayake',
    paymentMethod: 'Online',
    orderTotal: 23.0,
    etaMinutes: 35,
    createdAt: '12:40 PM',
    createdAtTimestamp: now - 26 * MIN,
    specialNotes: 'Call on arrival.',
    lastUpdatedBy: 'Dilan Rathnayake',
    lastUpdatedAt: '1:01 PM',
    version: 3,
    history: [
      { id: 'dh-gal-2', stage: 'Preparing', timestamp: '12:40 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'dh-gal-3', stage: 'Ready for Pickup', timestamp: '12:52 PM', user: 'Chamath Silva', role: 'chef' },
      { id: 'dh-gal-4', stage: 'Out for Delivery', timestamp: '1:01 PM', user: 'Dilan Rathnayake', role: 'rider' }
    ]
  }
];
