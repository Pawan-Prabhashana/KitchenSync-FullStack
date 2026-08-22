import { Order, DeliveryOrder } from '../../types';

/**
 * Kurunegala branch seed data.
 * Ids are city-prefixed (KUR) so they stay globally unique across branches.
 * TODO: Kurunegala team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-kurunegala';
const MIN = 60 * 1000;
const now = Date.now();

export const kurunegalaKitchenOrders: Order[] = [
  {
    id: '#ORD-KUR-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 01',
    items: [
      { id: 'm9', name: 'Cheese Burger', quantity: 2 },
      { id: 'd3', name: 'Lemonade', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:44 PM',
    createdAtTimestamp: now - 3 * MIN,
    waiter: 'Hasini Dias',
    specialNotes: 'No pickles.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '12:44 PM',
    version: 1,
    history: [
      { id: 'h-kur-1', stage: 'New', timestamp: '12:44 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-KUR-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 11',
    items: [
      { id: 'm10', name: 'Chicken Sandwich', quantity: 2 },
      { id: 'a3', name: 'French Fries', quantity: 1 }
    ],
    stage: 'Cooking',
    createdAt: '12:32 PM',
    createdAtTimestamp: now - 13 * MIN,
    waiter: 'Kavindu Cooray',
    chef: 'Chamath Silva',
    specialNotes: 'Toast the bread well.',
    lastUpdatedBy: 'Chamath Silva',
    lastUpdatedAt: '12:36 PM',
    version: 2,
    history: [
      { id: 'h-kur-2', stage: 'New', timestamp: '12:32 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'h-kur-3', stage: 'Cooking', timestamp: '12:36 PM', user: 'Chamath Silva', role: 'chef' }
    ]
  }
];

export const kurunegalaDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-KUR-2001',
    branchId: BRANCH_ID,
    customerName: 'Lakmal Wijesinghe',
    address: '27 Kandy Road, Kurunegala',
    distanceKm: 3.4,
    items: [
      { id: 'm5', name: 'Beef Burger', quantity: 1 },
      { id: 'a3', name: 'French Fries', quantity: 1 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Card',
    orderTotal: 19.0,
    etaMinutes: 35,
    createdAt: '1:07 PM',
    createdAtTimestamp: now - 3 * MIN,
    specialNotes: 'Opposite the clock tower.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '1:07 PM',
    version: 1,
    history: [
      { id: 'dh-kur-1', stage: 'Preparing', timestamp: '1:07 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-KUR-2002',
    branchId: BRANCH_ID,
    customerName: 'Sanduni Herath',
    address: '3 Puttalam Road, Kurunegala',
    distanceKm: 6.8,
    items: [
      { id: 'm4', name: 'Seafood Pasta', quantity: 1 },
      { id: 'sw2', name: 'Vanilla Ice Cream', quantity: 2 }
    ],
    stage: 'Out for Delivery',
    rider: 'Dilan Rathnayake',
    paymentMethod: 'Online',
    orderTotal: 28.0,
    etaMinutes: 40,
    createdAt: '12:39 PM',
    createdAtTimestamp: now - 27 * MIN,
    specialNotes: 'Keep the ice cream cold.',
    lastUpdatedBy: 'Dilan Rathnayake',
    lastUpdatedAt: '1:00 PM',
    version: 3,
    history: [
      { id: 'dh-kur-2', stage: 'Preparing', timestamp: '12:39 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'dh-kur-3', stage: 'Ready for Pickup', timestamp: '12:51 PM', user: 'Priya Fernando', role: 'chef' },
      { id: 'dh-kur-4', stage: 'Out for Delivery', timestamp: '1:00 PM', user: 'Dilan Rathnayake', role: 'rider' }
    ]
  }
];
