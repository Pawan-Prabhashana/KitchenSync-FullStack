import { Order } from '../types';

export const INITIAL_HARDCODED_ORDERS: Order[] = [
  {
    id: '#ORD-1001',
    branchId: 'br-colombo',
    tableNumber: 'Table 04',
    items: [
      { id: 'm1', name: 'Chicken Fried Rice', quantity: 2 },
      { id: 'a1', name: 'Veg Spring Rolls', quantity: 1 },
      { id: 'd1', name: 'Coke', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:42 PM',
    createdAtTimestamp: Date.now() - 3 * 60 * 1000,
    waiter: 'Nimal Jayasuriya',
    chef: undefined,
    specialNotes: 'Extra spicy fried rice, sauce on the side.',
    lastUpdatedBy: 'Nimal Jayasuriya',
    lastUpdatedAt: '12:42 PM',
    version: 1,
    history: [
      { id: 'h1', stage: 'New', timestamp: '12:42 PM', user: 'Nimal Jayasuriya', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-1002',
    branchId: 'br-colombo',
    tableNumber: 'Table 08',
    items: [
      { id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 },
      { id: 'a4', name: 'Garlic Bread', quantity: 2 },
      { id: 'd2', name: 'Iced Tea', quantity: 2 }
    ],
    stage: 'Cooking',
    createdAt: '12:35 PM',
    createdAtTimestamp: Date.now() - 10 * 60 * 1000,
    waiter: 'Hasini Dias',
    chef: 'Priya Fernando',
    specialNotes: 'Crispy crust on pizza.',
    lastUpdatedBy: 'Priya Fernando',
    lastUpdatedAt: '12:38 PM',
    version: 1,
    history: [
      { id: 'h2', stage: 'New', timestamp: '12:35 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'h3', stage: 'Cooking', timestamp: '12:38 PM', user: 'Priya Fernando', role: 'chef' }
    ]
  },
  {
    id: '#ORD-1003',
    branchId: 'br-colombo',
    tableNumber: 'Table 12',
    items: [
      { id: 'm2', name: 'Grilled Chicken', quantity: 2 },
      { id: 'a2', name: 'Mashed Potatoes', quantity: 1 },
      { id: 'd4', name: 'Fresh Mango Juice', quantity: 2 }
    ],
    stage: 'Cooking',
    createdAt: '12:28 PM',
    createdAtTimestamp: Date.now() - 17 * 60 * 1000,
    waiter: 'Kavindu Cooray',
    chef: 'Nuwan Perera',
    specialNotes: 'No gravy on potatoes.',
    lastUpdatedBy: 'Nuwan Perera',
    lastUpdatedAt: '12:30 PM',
    version: 1,
    history: [
      { id: 'h4', stage: 'New', timestamp: '12:28 PM', user: 'Kavindu Cooray', role: 'waiter' },
      { id: 'h5', stage: 'Cooking', timestamp: '12:30 PM', user: 'Nuwan Perera', role: 'chef' }
    ]
  },
  {
    id: '#ORD-1004',
    branchId: 'br-colombo',
    tableNumber: 'Table 02',
    items: [
      { id: 'm5', name: 'Beef Burger', quantity: 2 },
      { id: 'a3', name: 'French Fries', quantity: 2 }
    ],
    stage: 'Ready',
    createdAt: '12:20 PM',
    createdAtTimestamp: Date.now() - 25 * 60 * 1000,
    waiter: 'Nimal Jayasuriya',
    chef: 'Chamath Silva',
    specialNotes: 'Medium rare beef patties.',
    lastUpdatedBy: 'Chamath Silva',
    lastUpdatedAt: '12:40 PM',
    version: 1,
    history: [
      { id: 'h6', stage: 'New', timestamp: '12:20 PM', user: 'Nimal Jayasuriya', role: 'waiter' },
      { id: 'h7', stage: 'Cooking', timestamp: '12:25 PM', user: 'Chamath Silva', role: 'chef' },
      { id: 'h8', stage: 'Ready', timestamp: '12:40 PM', user: 'Chamath Silva', role: 'chef' }
    ]
  },
  {
    id: '#ORD-1005',
    branchId: 'br-colombo',
    tableNumber: 'Table 15',
    items: [
      { id: 'm4', name: 'Seafood Pasta', quantity: 1 },
      { id: 'sw1', name: 'Chocolate Lava Cake', quantity: 1 },
      { id: 'd3', name: 'Lemonade', quantity: 1 }
    ],
    stage: 'Served',
    createdAt: '12:05 PM',
    createdAtTimestamp: Date.now() - 40 * 60 * 1000,
    waiter: 'Hasini Dias',
    chef: 'Priya Fernando',
    servedAt: '12:32 PM',
    servedAtTimestamp: Date.now() - 13 * 60 * 1000,
    specialNotes: 'Birthday celebration table.',
    lastUpdatedBy: 'Hasini Dias',
    lastUpdatedAt: '12:32 PM',
    version: 1,
    history: [
      { id: 'h9', stage: 'New', timestamp: '12:05 PM', user: 'Hasini Dias', role: 'waiter' },
      { id: 'h10', stage: 'Cooking', timestamp: '12:10 PM', user: 'Priya Fernando', role: 'chef' },
      { id: 'h11', stage: 'Ready', timestamp: '12:28 PM', user: 'Priya Fernando', role: 'chef' },
      { id: 'h12', stage: 'Served', timestamp: '12:32 PM', user: 'Hasini Dias', role: 'waiter' }
    ]
  },
  {
    id: '#ORD-1006',
    branchId: 'br-colombo',
    tableNumber: 'Table 01',
    items: [
      { id: 'm6', name: 'Fish & Chips', quantity: 2 },
      { id: 'a5', name: 'Tartar Sauce', quantity: 2 }
    ],
    stage: 'New',
    createdAt: '12:44 PM',
    createdAtTimestamp: Date.now() - 1 * 60 * 1000,
    waiter: 'Kavindu Cooray',
    chef: undefined,
    specialNotes: 'Extra lemon wedges please.',
    lastUpdatedBy: 'Kavindu Cooray',
    lastUpdatedAt: '12:44 PM',
    version: 1,
    history: [
      { id: 'h13', stage: 'New', timestamp: '12:44 PM', user: 'Kavindu Cooray', role: 'waiter' }
    ]
  }
];
