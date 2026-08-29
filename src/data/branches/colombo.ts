import { Order, DeliveryOrder } from '../../types';

/**
 * Colombo branch seed data.
 * Ids are city-prefixed (COL) so they stay globally unique across branches.
 * TODO: Colombo team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-colombo';
const MIN = 60 * 1000;
const now = Date.now();

export const colomboKitchenOrders: Order[] = [
  {
    id: '#ORD-COL-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 04',
    items: [
      { id: 'm1', name: 'Chicken Fried Rice', quantity: 2 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:40 PM',
    createdAtTimestamp: now - 4 * MIN,
    waiter: 'Nimal Jayasuriya',
    specialNotes: 'Extra spicy fried rice, sauce on the side.',
    lastUpdatedBy: 'Nimal Jayasuriya',
    lastUpdatedAt: '12:40 PM',
    version: 1,
    history: [
      { id: 'h-col-1', stage: 'New', timestamp: '12:40 PM', user: 'Nimal Jayasuriya', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-COL-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 09',
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'a4', name: 'Garlic Bread', quantity: 2 }
    ],
    stage: 'Cooking',
    createdAt: '12:31 PM',
    createdAtTimestamp: now - 12 * MIN,
    waiter: 'Hasini Dias',
    chef: 'Priya Fernando',
    specialNotes: 'Crispy crust.',
    lastUpdatedBy: 'Priya Fernando',
    lastUpdatedAt: '12:34 PM',
    version: 2,
    history: [
      { id: 'h-col-2', stage: 'New', timestamp: '12:31 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'h-col-3', stage: 'Cooking', timestamp: '12:34 PM', user: 'Priya Fernando', role: 'chef' }
    ]
  }
];

export const colomboDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-COL-2001',
    branchId: BRANCH_ID,
    customerName: 'Amaya Wijesinghe',
    address: '42 Horton Place, Colombo 07',
    distanceKm: 3.2,
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Online',
    orderTotal: 24.5,
    etaMinutes: 35,
    createdAt: '1:02 PM',
    createdAtTimestamp: now - 6 * MIN,
    specialNotes: 'Ring the bell twice — apartment 4B.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '1:02 PM',
    version: 1,
    history: [
      { id: 'dh-col-1', stage: 'Preparing', timestamp: '1:02 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-COL-2002',
    branchId: BRANCH_ID,
    customerName: 'Ruwan Jayakody',
    address: '15 Galle Road, Colombo 03',
    distanceKm: 5.1,
    items: [
      { id: 'm5', name: 'Beef Burger', quantity: 2 },
      { id: 'a3', name: 'French Fries', quantity: 2 }
    ],
    stage: 'Out for Delivery',
    rider: 'Sanjaya Bandara',
    paymentMethod: 'Cash',
    orderTotal: 38.0,
    etaMinutes: 40,
    createdAt: '12:48 PM',
    createdAtTimestamp: now - 24 * MIN,
    specialNotes: 'Cash on delivery — customer has exact change.',
    lastUpdatedBy: 'Sanjaya Bandara',
    lastUpdatedAt: '1:05 PM',
    version: 3,
    history: [
      { id: 'dh-col-2', stage: 'Preparing', timestamp: '12:48 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'dh-col-3', stage: 'Ready for Pickup', timestamp: '12:58 PM', user: 'Nuwan Perera', role: 'chef' },
      { id: 'dh-col-4', stage: 'Out for Delivery', timestamp: '1:05 PM', user: 'Sanjaya Bandara', role: 'rider' }
    ]
  }
];
