import { Order, DeliveryOrder } from '../../types';

/**
 * Jaffna branch seed data.
 * Ids are city-prefixed (JAF) so they stay globally unique across branches.
 * TODO: Jaffna team — add more realistic local orders here.
 */
const BRANCH_ID = 'br-jaffna';
const MIN = 60 * 1000;
const now = Date.now();

export const jaffnaKitchenOrders: Order[] = [
  {
    id: '#ORD-JAF-1001',
    branchId: BRANCH_ID,
    tableNumber: 'Table 05',
    items: [
      { id: 'm8', name: 'Chicken Wrap', quantity: 2 },
      { id: 'd2', name: 'Iced Tea', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:43 PM',
    createdAtTimestamp: now - 3 * MIN,
    waiter: 'Nimal Jayasuriya',
    specialNotes: 'No mayo in the wraps.',
    lastUpdatedBy: 'Nimal Jayasuriya',
    lastUpdatedAt: '12:43 PM',
    version: 1,
    history: [
      { id: 'h-jaf-1', stage: 'New', timestamp: '12:43 PM', user: 'Nimal Jayasuriya', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-JAF-1002',
    branchId: BRANCH_ID,
    tableNumber: 'Table 10',
    items: [
      { id: 'm5', name: 'Beef Burger', quantity: 2 },
      { id: 'a3', name: 'French Fries', quantity: 2 }
    ],
    stage: 'Cooking',
    createdAt: '12:27 PM',
    createdAtTimestamp: now - 18 * MIN,
    waiter: 'Hasini Dias',
    chef: 'Priya Fernando',
    specialNotes: 'Medium rare patties.',
    lastUpdatedBy: 'Priya Fernando',
    lastUpdatedAt: '12:32 PM',
    version: 2,
    history: [
      { id: 'h-jaf-2', stage: 'New', timestamp: '12:27 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'h-jaf-3', stage: 'Cooking', timestamp: '12:32 PM', user: 'Priya Fernando', role: 'chef' }
    ]
  }
];

export const jaffnaDeliveryOrders: DeliveryOrder[] = [
  {
    id: '#DEL-JAF-2001',
    branchId: BRANCH_ID,
    customerName: 'Dinuka Bandara',
    address: '33 Hospital Road, Jaffna',
    distanceKm: 3.0,
    items: [
      { id: 'm7', name: 'Veg Curry & Steamed Rice', quantity: 2 },
      { id: 'd4', name: 'Fresh Mango Juice', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Card',
    orderTotal: 32.0,
    etaMinutes: 35,
    createdAt: '1:03 PM',
    createdAtTimestamp: now - 5 * MIN,
    specialNotes: 'Leave at reception.',
    lastUpdatedBy: 'Nimal Jayasuriya',
    lastUpdatedAt: '1:03 PM',
    version: 1,
    history: [
      { id: 'dh-jaf-1', stage: 'Preparing', timestamp: '1:03 PM', user: 'Nimal Jayasuriya', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-JAF-2002',
    branchId: BRANCH_ID,
    customerName: 'Kavya Fonseka',
    address: '9 KKS Road, Jaffna',
    distanceKm: 7.1,
    items: [
      { id: 'm9', name: 'Cheese Burger', quantity: 2 },
      { id: 'a3', name: 'French Fries', quantity: 1 }
    ],
    stage: 'Out for Delivery',
    rider: 'Ishara Gunawardena',
    paymentMethod: 'Cash',
    orderTotal: 30.5,
    etaMinutes: 45,
    createdAt: '12:35 PM',
    createdAtTimestamp: now - 30 * MIN,
    specialNotes: 'Running late — heavy traffic.',
    lastUpdatedBy: 'Ishara Gunawardena',
    lastUpdatedAt: '12:58 PM',
    version: 3,
    history: [
      { id: 'dh-jaf-2', stage: 'Preparing', timestamp: '12:35 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'dh-jaf-3', stage: 'Ready for Pickup', timestamp: '12:47 PM', user: 'Nuwan Perera', role: 'chef' },
      { id: 'dh-jaf-4', stage: 'Out for Delivery', timestamp: '12:58 PM', user: 'Ishara Gunawardena', role: 'rider' }
    ]
  }
];
