import { Order, DeliveryOrder } from '../../types';

/**
 * Batticaloa branch seed data.
 * Ids are city-prefixed (BAT) so they stay globally unique across branches.
 * TODO: Batticaloa team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-batticaloa';
const MIN = 60 * 1000;
const now = Date.now();

export const batticaloaKitchenOrders: Order[] = [
  {
    id: '#ORD-BAT-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 06',
    items: [
      { id: 'm1', name: 'Chicken Fried Rice', quantity: 2 },
      { id: 'd2', name: 'Iced Tea', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:45 PM',
    createdAtTimestamp: now - 2 * MIN,
    waiter: 'Kavindu Cooray',
    specialNotes: 'Add extra chilli paste.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '12:45 PM',
    version: 1,
    history: [
      { id: 'h-bat-1', stage: 'New', timestamp: '12:45 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-BAT-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 13',
    items: [
      { id: 'm4', name: 'Seafood Pasta', quantity: 1 },
      { id: 'sw1', name: 'Chocolate Lava Cake', quantity: 1 }
    ],
    stage: 'Cooking',
    createdAt: '12:31 PM',
    createdAtTimestamp: now - 14 * MIN,
    waiter: 'Nimal Jayasuriya',
    chef: 'Nuwan Perera',
    specialNotes: 'Birthday table — bring cake last.',
    lastUpdatedBy: 'Nuwan Perera',
    lastUpdatedAt: '12:35 PM',
    version: 2,
    history: [
      { id: 'h-bat-2', stage: 'New', timestamp: '12:31 PM', user: 'Nimal Jayasuriya', role: 'waiter' },
      { id: 'h-bat-3', stage: 'Cooking', timestamp: '12:35 PM', user: 'Nuwan Perera', role: 'chef' }
    ]
  }
];

export const batticaloaDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-BAT-2001',
    branchId: BRANCH_ID,
    customerName: 'Sachini Alwis',
    address: '8 Trinco Road, Batticaloa',
    distanceKm: 3.1,
    items: [
      { id: 'm6', name: 'Fish & Chips', quantity: 2 },
      { id: 'a5', name: 'Tartar Sauce', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Card',
    orderTotal: 33.0,
    etaMinutes: 35,
    createdAt: '1:06 PM',
    createdAtTimestamp: now - 4 * MIN,
    specialNotes: 'By the lagoon bridge.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '1:06 PM',
    version: 1,
    history: [
      { id: 'dh-bat-1', stage: 'Preparing', timestamp: '1:06 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-BAT-2002',
    branchId: BRANCH_ID,
    customerName: 'Menaka Peris',
    address: '55 Bar Road, Batticaloa',
    distanceKm: 6.5,
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 1 },
      { id: 'a2', name: 'Mashed Potatoes', quantity: 1 }
    ],
    stage: 'Out for Delivery',
    rider: 'Ishara Gunawardena',
    paymentMethod: 'Cash',
    orderTotal: 21.0,
    etaMinutes: 40,
    createdAt: '12:40 PM',
    createdAtTimestamp: now - 26 * MIN,
    specialNotes: 'Yellow house, blue gate.',
    lastUpdatedBy: 'Ishara Gunawardena',
    lastUpdatedAt: '1:01 PM',
    version: 3,
    history: [
      { id: 'dh-bat-2', stage: 'Preparing', timestamp: '12:40 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'dh-bat-3', stage: 'Ready for Pickup', timestamp: '12:52 PM', user: 'Chamath Silva', role: 'chef' },
      { id: 'dh-bat-4', stage: 'Out for Delivery', timestamp: '1:01 PM', user: 'Ishara Gunawardena', role: 'rider' }
    ]
  }
];
