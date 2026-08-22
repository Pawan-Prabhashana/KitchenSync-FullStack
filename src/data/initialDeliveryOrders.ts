import { DeliveryOrder } from '../types';

const min = 60 * 1000;

export const INITIAL_HARDCODED_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: '#DEL-2001',
    branchId: 'br-colombo',
    customerName: 'Amaya Wijesinghe',
    address: '42/1 Horton Place, Colombo 07',
    distanceKm: 3.2,
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'a4', name: 'Garlic Bread', quantity: 1 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Online',
    orderTotal: 27.5,
    etaMinutes: 35,
    createdAt: '1:02 PM',
    createdAtTimestamp: Date.now() - 4 * min,
    specialNotes: 'Ring the bell twice — apartment 4B.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '1:02 PM',
    version: 1,
    history: [
      { id: 'dh1', stage: 'Preparing', timestamp: '1:02 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-2002',
    branchId: 'br-colombo',
    customerName: 'Ruwan Jayakody',
    address: '15 Bauddhaloka Mawatha, Colombo 04',
    distanceKm: 5.1,
    items: [
      { id: 'm5', name: 'Beef Burger', quantity: 2 },
      { id: 'a3', name: 'French Fries', quantity: 2 },
      { id: 'd3', name: 'Lemonade', quantity: 2 }
    ],
    stage: 'Preparing',
    paymentMethod: 'Cash',
    orderTotal: 42.0,
    etaMinutes: 40,
    createdAt: '12:58 PM',
    createdAtTimestamp: Date.now() - 9 * min,
    specialNotes: 'Cash on delivery — customer has exact change.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '12:58 PM',
    version: 1,
    history: [
      { id: 'dh2', stage: 'Preparing', timestamp: '12:58 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  },
  {
    id: '#DEL-2003',
    branchId: 'br-colombo',
    customerName: 'Sachini Peris',
    address: '88 Galle Road, Mount Lavinia',
    distanceKm: 8.7,
    items: [
      { id: 'm4', name: 'Seafood Pasta', quantity: 1 },
      { id: 'sw1', name: 'Chocolate Lava Cake', quantity: 2 }
    ],
    stage: 'Ready for Pickup',
    paymentMethod: 'Card',
    orderTotal: 35.0,
    etaMinutes: 45,
    createdAt: '12:49 PM',
    createdAtTimestamp: Date.now() - 18 * min,
    rider: undefined,
    specialNotes: 'Leave dessert boxes upright.',
    lastUpdatedBy: 'Priya Fernando',
    lastUpdatedAt: '1:05 PM',
    version: 1,
    history: [
      { id: 'dh3', stage: 'Preparing', timestamp: '12:49 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'dh4', stage: 'Ready for Pickup', timestamp: '1:05 PM', user: 'Priya Fernando', role: 'chef' }
    ]
  },
  {
    id: '#DEL-2004',
    branchId: 'br-colombo',
    customerName: 'Menaka Herath',
    address: '7 Duplication Road, Colombo 03',
    distanceKm: 2.4,
    items: [
      { id: 'm7', name: 'Veg Curry & Steamed Rice', quantity: 2 },
      { id: 'd4', name: 'Fresh Mango Juice', quantity: 2 }
    ],
    stage: 'Out for Delivery',
    paymentMethod: 'Online',
    orderTotal: 32.0,
    etaMinutes: 30,
    createdAt: '12:40 PM',
    createdAtTimestamp: Date.now() - 27 * min,
    rider: 'Sanjaya Bandara',
    specialNotes: 'Office reception — ask for Menaka.',
    lastUpdatedBy: 'Sanjaya Bandara',
    lastUpdatedAt: '1:01 PM',
    version: 1,
    history: [
      { id: 'dh5', stage: 'Preparing', timestamp: '12:40 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'dh6', stage: 'Ready for Pickup', timestamp: '12:52 PM', user: 'Nuwan Perera', role: 'chef' },
      { id: 'dh7', stage: 'Out for Delivery', timestamp: '1:01 PM', user: 'Sanjaya Bandara', role: 'rider' }
    ]
  },
  {
    id: '#DEL-2005',
    branchId: 'br-colombo',
    customerName: 'Chathura Alwis',
    address: '120 Nawala Road, Nugegoda',
    distanceKm: 6.9,
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 1 },
      { id: 'a6', name: 'Garden Salad', quantity: 1 },
      { id: 'd2', name: 'Iced Tea', quantity: 1 }
    ],
    stage: 'Out for Delivery',
    paymentMethod: 'Card',
    orderTotal: 26.5,
    etaMinutes: 35,
    createdAt: '12:30 PM',
    createdAtTimestamp: Date.now() - 42 * min,
    rider: 'Dilan Rathnayake',
    specialNotes: 'Running late — heavy traffic on Nawala Road.',
    lastUpdatedBy: 'Dilan Rathnayake',
    lastUpdatedAt: '12:58 PM',
    version: 1,
    history: [
      { id: 'dh8', stage: 'Preparing', timestamp: '12:30 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'dh9', stage: 'Ready for Pickup', timestamp: '12:44 PM', user: 'Chamath Silva', role: 'chef' },
      { id: 'dh10', stage: 'Out for Delivery', timestamp: '12:58 PM', user: 'Dilan Rathnayake', role: 'rider' }
    ]
  },
  {
    id: '#DEL-2006',
    branchId: 'br-colombo',
    customerName: 'Nethmi Rajapaksha',
    address: '33 Marine Drive, Colombo 06',
    distanceKm: 4.5,
    items: [
      { id: 'm1', name: 'Chicken Fried Rice', quantity: 2 },
      { id: 'a1', name: 'Veg Spring Rolls', quantity: 2 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'Delivered',
    paymentMethod: 'Online',
    orderTotal: 38.0,
    etaMinutes: 40,
    createdAt: '12:05 PM',
    createdAtTimestamp: Date.now() - 62 * min,
    deliveredAt: '12:47 PM',
    deliveredAtTimestamp: Date.now() - 20 * min,
    rider: 'Tharindu Fonseka',
    specialNotes: 'Left with security as requested.',
    lastUpdatedBy: 'Tharindu Fonseka',
    lastUpdatedAt: '12:47 PM',
    version: 1,
    history: [
      { id: 'dh11', stage: 'Preparing', timestamp: '12:05 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'dh12', stage: 'Ready for Pickup', timestamp: '12:18 PM', user: 'Priya Fernando', role: 'chef' },
      { id: 'dh13', stage: 'Out for Delivery', timestamp: '12:26 PM', user: 'Tharindu Fonseka', role: 'rider' },
      { id: 'dh14', stage: 'Delivered', timestamp: '12:47 PM', user: 'Tharindu Fonseka', role: 'rider' }
    ]
  }
];
