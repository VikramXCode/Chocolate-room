import type { MenuItem, Order, Review, Table, User, CafeSettings, WaiterNotification } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@chocolateroom.in', role: 'superadmin', avatar: '' },
  { id: 'u2', name: 'rajasaab', email: 'priya@chocolateroom.in', role: 'admin', avatar: '' },
  { id: 'u3', name: 'Arun M', email: 'arun@chocolateroom.in', role: 'waiter', avatar: '' },
  { id: 'u4', name: 'Deepa V', email: 'deepa@chocolateroom.in', role: 'waiter', avatar: '' },
  { id: 'u5', name: 'Guest User', email: 'guest@example.com', role: 'customer', avatar: '' },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: 'm1', name: 'Belgian Dark Hot Chocolate', description: 'Rich 72% dark Belgian cocoa blended with steamed milk and topped with whipped cream',
    price: 249, category: 'Hot Chocolate', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm2', name: 'Classic Swiss Hot Chocolate', description: 'Traditional Swiss-style hot chocolate with premium cocoa and a hint of vanilla',
    price: 199, category: 'Hot Chocolate', image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm3', name: 'Hazelnut Hot Chocolate', description: 'Creamy hot chocolate infused with roasted hazelnut syrup and cocoa nibs',
    price: 279, category: 'Hot Chocolate', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm4', name: 'Iced Mocha Frappe', description: 'Espresso blended with chocolate sauce, cold milk, and ice, finished with whipped cream',
    price: 299, category: 'Cold Beverages', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm5', name: 'Cold Coffee Chocolate', description: 'Refreshing cold brew coffee mixed with chocolate and served over ice',
    price: 229, category: 'Cold Beverages', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm6', name: 'Mint Chocolate Shake', description: 'Cool peppermint blended with rich chocolate ice cream and milk',
    price: 269, category: 'Shakes', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm7', name: 'Oreo Chocolate Shake', description: 'Crushed Oreo cookies blended with chocolate ice cream and topped with cream',
    price: 289, category: 'Shakes', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm8', name: 'Death by Chocolate Cake', description: 'Layered dark chocolate cake with ganache, truffle filling, and chocolate shavings',
    price: 349, category: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm9', name: 'Red Velvet Pastry', description: 'Classic red velvet with cream cheese frosting and dark chocolate drizzle',
    price: 199, category: 'Cakes', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm10', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream',
    price: 329, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm11', name: 'Tiramisu', description: 'Italian classic with espresso-soaked ladyfingers, mascarpone cream, and cocoa',
    price: 299, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm12', name: 'Chocolate Brownie Sundae', description: 'Warm fudge brownie topped with chocolate and vanilla ice cream, hot fudge, and nuts',
    price: 279, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', available: false, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm13', name: 'Belgian Chocolate Waffle', description: 'Crispy golden waffle drizzled with Belgian chocolate sauce and fresh strawberries',
    price: 259, category: 'Waffles', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm14', name: 'Nutella Banana Waffle', description: 'Warm waffle loaded with Nutella spread, sliced bananas, and chocolate chips',
    price: 289, category: 'Waffles', image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm15', name: 'Chocolate Panini', description: 'Grilled panini filled with dark chocolate, cheese, and caramelised nuts',
    price: 219, category: 'Snacks', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm16', name: 'Churros with Chocolate Dip', description: 'Crispy cinnamon-sugar churros served with warm Belgian chocolate dipping sauce',
    price: 199, category: 'Snacks', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm17', name: "Chef's Special Fondue", description: 'Premium chocolate fondue with assorted fruits, marshmallows, and cookies for dipping',
    price: 599, category: 'Specials', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400', available: true, popular: true, veg: true, prepTimeMinutes: 10,
  },
  {
    id: 'm18', name: 'Truffle Collection Box', description: 'Handcrafted box of 12 assorted chocolate truffles — dark, milk, and white',
    price: 499, category: 'Specials', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', available: true, veg: true, prepTimeMinutes: 10,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1', items: [{ menuItemId: 'm1', name: 'Belgian Dark Hot Chocolate', quantity: 2, price: 249 }, { menuItemId: 'm8', name: 'Death by Chocolate Cake', quantity: 1, price: 349 }],
    status: 'preparing', type: 'dine-in', tableNumber: 3, customerName: 'Karthik S', customerPhone: '9876543210', paymentMethod: 'upi', total: 847, createdAt: '2026-03-05T10:30:00', waiterId: 'u3',
  },
  {
    id: 'o2', items: [{ menuItemId: 'm4', name: 'Iced Mocha Frappe', quantity: 1, price: 299 }, { menuItemId: 'm13', name: 'Belgian Chocolate Waffle', quantity: 1, price: 259 }],
    status: 'confirmed', type: 'dine-in', tableNumber: 7, customerName: 'Meera R', customerPhone: '9876543211', paymentMethod: 'card', total: 558, createdAt: '2026-03-05T11:15:00', waiterId: 'u3',
  },
  {
    id: 'o3', items: [{ menuItemId: 'm10', name: 'Chocolate Lava Cake', quantity: 2, price: 329 }, { menuItemId: 'm6', name: 'Mint Chocolate Shake', quantity: 2, price: 269 }],
    status: 'pending', type: 'delivery', customerName: 'Suresh V', customerPhone: '9876543212', address: '45 Anna Nagar, Tirupur', paymentMethod: 'upi', total: 1196, createdAt: '2026-03-05T11:45:00',
  },
  {
    id: 'o4', items: [{ menuItemId: 'm17', name: "Chef's Special Fondue", quantity: 1, price: 599 }],
    status: 'served', type: 'dine-in', tableNumber: 1, customerName: 'Anitha P', customerPhone: '9876543213', paymentMethod: 'cash', total: 599, createdAt: '2026-03-05T09:00:00', waiterId: 'u4',
  },
  {
    id: 'o5', items: [{ menuItemId: 'm7', name: 'Oreo Chocolate Shake', quantity: 3, price: 289 }, { menuItemId: 'm15', name: 'Chocolate Panini', quantity: 2, price: 219 }],
    status: 'ready', type: 'dine-in', tableNumber: 5, customerName: 'Vikram K', customerPhone: '9876543214', paymentMethod: 'card', total: 1305, createdAt: '2026-03-05T12:00:00', waiterId: 'u4',
  },
  {
    id: 'o6', items: [{ menuItemId: 'm2', name: 'Classic Swiss Hot Chocolate', quantity: 1, price: 199 }],
    status: 'cancelled', type: 'takeaway', customerName: 'Divya M', customerPhone: '9876543215', paymentMethod: 'upi', total: 199, createdAt: '2026-03-05T08:30:00',
  },
];

export const mockReviews: Review[] = [
  { id: 'r1', customerName: 'Karthik S', rating: 5, comment: 'Best chocolate café in Tirupur! The Belgian Dark Hot Chocolate is absolutely divine.', date: '2026-03-04', highlighted: true },
  { id: 'r2', customerName: 'Meera R', rating: 4, comment: 'Loved the ambiance and the Death by Chocolate cake was amazing. Will visit again!', date: '2026-03-03' },
  { id: 'r3', customerName: 'Suresh V', rating: 5, comment: 'The fondue experience was phenomenal. Perfect for a family outing.', date: '2026-03-02', highlighted: true },
  { id: 'r4', customerName: 'Anitha P', rating: 3, comment: 'Food was good but the waiting time was a bit long. Service could improve.', date: '2026-03-01' },
  { id: 'r5', customerName: 'Vikram K', rating: 5, comment: 'Hands down the best waffles I have ever had. The chocolate sauce is heavenly!', date: '2026-02-28' },
  { id: 'r6', customerName: 'Lakshmi N', rating: 4, comment: 'Great place for chocolate lovers. The truffle collection box makes a perfect gift.', date: '2026-02-27' },
  { id: 'r7', customerName: 'Ramesh B', rating: 2, comment: 'Portions could be bigger for the price. Taste was okay.', date: '2026-02-26', flagged: true },
  { id: 'r8', customerName: 'Priyanka D', rating: 5, comment: 'The lava cake with ice cream is a must-try! Beautiful café décor too.', date: '2026-02-25' },
];

export const mockTables: Table[] = [
  { id: 't1', number: 1, seats: 2, status: 'available', assignedWaiter: 'u3' },
  { id: 't2', number: 2, seats: 4, status: 'available', assignedWaiter: 'u3' },
  { id: 't3', number: 3, seats: 4, status: 'occupied', assignedWaiter: 'u3', currentOrderId: 'o1' },
  { id: 't4', number: 4, seats: 6, status: 'available', assignedWaiter: 'u4' },
  { id: 't5', number: 5, seats: 4, status: 'occupied', assignedWaiter: 'u4', currentOrderId: 'o5' },
  { id: 't6', number: 6, seats: 2, status: 'reserved', assignedWaiter: 'u4' },
  { id: 't7', number: 7, seats: 4, status: 'occupied', assignedWaiter: 'u3', currentOrderId: 'o2' },
  { id: 't8', number: 8, seats: 8, status: 'available', assignedWaiter: 'u3' },
  { id: 't9', number: 9, seats: 2, status: 'available', assignedWaiter: 'u4' },
  { id: 't10', number: 10, seats: 6, status: 'reserved', assignedWaiter: 'u4' },
];

export const mockNotifications: WaiterNotification[] = [
  { id: 'n1', tableNumber: 3, type: 'call', message: 'Customer is calling for assistance', time: '2 min ago', read: false },
  { id: 'n2', tableNumber: 7, type: 'order', message: 'New order placed at table 7', time: '5 min ago', read: false },
  { id: 'n3', tableNumber: 5, type: 'bill', message: 'Customer requesting bill', time: '10 min ago', read: true },
];

export const mockSettings: CafeSettings = {
  cafeName: 'The Chocolate Room',
  location: 'Tirupur, Tamil Nadu',
  phone: '+91 98765 43210',
  email: 'info@chocolateroom-tirupur.in',
  openingHours: '10:00 AM – 11:00 PM',
  features: {
    delivery: true,
    qrOrdering: true,
    reviews: true,
    onlinePayment: true,
  },
};
