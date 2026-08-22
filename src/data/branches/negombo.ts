import { Order, DeliveryOrder } from '../../types';

/**
 * Negombo branch seed data.
 * Ids are city-prefixed (NEG) so they stay globally unique across branches.
 * TODO: Negombo team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-negombo';
const MIN = 60 * 1000;
const now = Date.now();

export const negomboKitchenOrders: Order[] = [
  {
    id: '#ORD-NEG-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 08',
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:46 PM',
    createdAtTimestamp: now - 2 * MIN,
    waiter: 'Kavindu Cooray',
    specialNotes: 'Thin crust.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '12:46 PM',
    version: 1,
    history: [
      { id: 'h-neg-1', stage: 'New', timestamp: '12:46 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-NEG-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 12',
    items: [
      { id: 'm6', name: 'Fish & Chips', quantity: 1 },
      { id: 'a5', name: 'Tartar Sauce', quantity: 1 }
    ],
    stage: 'Cooking',
    createdAt: '12:30 PM',
    createdAtTimestamp: now - 15 * MIN,
    waiter: 'Nimal Jayasuriya',
    chef: 'Nuwan Perera',
    specialNotes: 'Extra crispy.',
    lastUpdatedBy: 'Nuwan Perera',
    lastUpdatedAt: '12:35 PM',
    version: 2,
    history: [
      { id: 'h-neg-2', stage: 'New', timestamp: '12:30 PM', user: 'Nimal Jayasuriya', role: 'waiter' },
      { id: 'h-neg-3', stage: 'Cooking', timestamp: '12:35 PM', user: 'Nuwan Perera', role: 'chef' }
    ]
  }
];

export const negomboDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-NEG-2001',
    branchId: BRANCH_ID,
    customerName: 'Isuru Gunasekara',
    address: '4 Lewis Place, Negombo',
    distanceKm: 2.9,
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 1 },
      { id: 'd3', name: 'Lemonade', quantity: 1 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Online',
    orderTotal: 20.0,
    etaMinutes: 30,
    createdAt: '1:05 PM',
    createdAtTimestamp: now - 4 * MIN,
    specialNotes: 'Beachfront apartments, block C.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '1:05 PM',
    version: 1,
    history: [
      { id: 'dh-neg-1', stage: 'Preparing', timestamp: '1:05 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-NEG-2002',
    branchId: BRANCH_ID,
    customerName: 'Tharushi Ekanayake',
    address: '61 Beach Road, Negombo',
    distanceKm: 5.5,
    items: [
      { id: 'm1', name: 'Chicken Fried Rice', quantity: 2 },
      { id: 'a1', name: 'Veg Spring Rolls', quantity: 2 }
    ],
    stage: 'Out for Delivery',
    rider: 'Sanjaya Bandara',
    paymentMethod: 'Cash',
    orderTotal: 33.0,
    etaMinutes: 40,
    createdAt: '12:41 PM',
    createdAtTimestamp: now - 25 * MIN,
    specialNotes: 'Gate code 4321.',
    lastUpdatedBy: 'Sanjaya Bandara',
    lastUpdatedAt: '1:02 PM',
    version: 3,
    history: [
      { id: 'dh-neg-2', stage: 'Preparing', timestamp: '12:41 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'dh-neg-3', stage: 'Ready for Pickup', timestamp: '12:53 PM', user: 'Chamath Silva', role: 'chef' },
      { id: 'dh-neg-4', stage: 'Out for Delivery', timestamp: '1:02 PM', user: 'Sanjaya Bandara', role: 'rider' }
    ]
  }
];
