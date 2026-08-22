import { Order, DeliveryOrder } from '../../types';

/**
 * Anuradhapura branch seed data.
 * Ids are city-prefixed (ANU) so they stay globally unique across branches.
 * TODO: Anuradhapura team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-anuradhapura';
const MIN = 60 * 1000;
const now = Date.now();

export const anuradhapuraKitchenOrders: Order[] = [
  {
    id: '#ORD-ANU-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 04',
    items: [
      { id: 'm7', name: 'Veg Curry & Steamed Rice', quantity: 2 },
      { id: 'd4', name: 'Fresh Mango Juice', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:42 PM',
    createdAtTimestamp: now - 3 * MIN,
    waiter: 'Nimal Jayasuriya',
    specialNotes: 'Vegetarian — no egg.',
    lastUpdatedBy: 'Nimal Jayasuriya',
    lastUpdatedAt: '12:42 PM',
    version: 1,
    history: [
      { id: 'h-anu-1', stage: 'New', timestamp: '12:42 PM', user: 'Nimal Jayasuriya', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-ANU-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 09',
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 2 },
      { id: 'a6', name: 'Garden Salad', quantity: 1 }
    ],
    stage: 'Cooking',
    createdAt: '12:28 PM',
    createdAtTimestamp: now - 17 * MIN,
    waiter: 'Kavindu Cooray',
    chef: 'Priya Fernando',
    specialNotes: 'Dressing on the side.',
    lastUpdatedBy: 'Priya Fernando',
    lastUpdatedAt: '12:31 PM',
    version: 2,
    history: [
      { id: 'h-anu-2', stage: 'New', timestamp: '12:28 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'h-anu-3', stage: 'Cooking', timestamp: '12:31 PM', user: 'Priya Fernando', role: 'chef' }
    ]
  }
];

export const anuradhapuraDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-ANU-2001',
    branchId: BRANCH_ID,
    customerName: 'Amaya Rajapaksha',
    address: '14 Sacred City Road, Anuradhapura',
    distanceKm: 3.6,
    items: [
      { id: 'm8', name: 'Chicken Wrap', quantity: 2 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Cash',
    orderTotal: 27.0,
    etaMinutes: 35,
    createdAt: '1:04 PM',
    createdAtTimestamp: now - 5 * MIN,
    specialNotes: 'Near the old tank.',
    lastUpdatedBy: 'Nimal Jayasuriya',
    lastUpdatedAt: '1:04 PM',
    version: 1,
    history: [
      { id: 'dh-anu-1', stage: 'Preparing', timestamp: '1:04 PM', user: 'Nimal Jayasuriya', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-ANU-2002',
    branchId: BRANCH_ID,
    customerName: 'Ruwan Ekanayake',
    address: '40 Maithripala Senanayake Mawatha, Anuradhapura',
    distanceKm: 7.4,
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'a4', name: 'Garlic Bread', quantity: 2 }
    ],
    stage: 'Out for Delivery',
    rider: 'Tharindu Fonseka',
    paymentMethod: 'Online',
    orderTotal: 26.5,
    etaMinutes: 45,
    createdAt: '12:37 PM',
    createdAtTimestamp: now - 29 * MIN,
    specialNotes: 'Call when outside.',
    lastUpdatedBy: 'Tharindu Fonseka',
    lastUpdatedAt: '12:59 PM',
    version: 3,
    history: [
      { id: 'dh-anu-2', stage: 'Preparing', timestamp: '12:37 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'dh-anu-3', stage: 'Ready for Pickup', timestamp: '12:49 PM', user: 'Nuwan Perera', role: 'chef' },
      { id: 'dh-anu-4', stage: 'Out for Delivery', timestamp: '12:59 PM', user: 'Tharindu Fonseka', role: 'rider' }
    ]
  }
];
