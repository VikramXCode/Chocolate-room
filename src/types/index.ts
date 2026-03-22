export type UserRole = 'superadmin' | 'admin' | 'waiter' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  available: boolean;
  popular?: boolean;
  veg: boolean;
  prepTimeMinutes?: number;
  prepTimeMinutes?: number;
}

export type MenuCategory =
  | 'Hot Chocolate'
  | 'Cold Beverages'
  | 'Desserts'
  | 'Cakes'
  | 'Snacks'
  | 'Shakes'
  | 'Waffles'
  | 'Specials';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type OrderType = 'dine-in' | 'delivery' | 'takeaway';
export type PaymentMethod = 'upi' | 'card' | 'cash';

export interface Order {
  id: string;
  items: { menuItemId: string; name: string; quantity: number; price: number }[];
  status: OrderStatus;
  type: OrderType;
  tableNumber?: number;
  customerName: string;
  customerPhone: string;
  address?: string;
  paymentMethod: PaymentMethod;
  total: number;
  createdAt: string;
  waiterId?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  flagged?: boolean;
  highlighted?: boolean;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  assignedWaiter?: string;
  currentOrderId?: string;
}

export interface CafeSettings {
  cafeName: string;
  location: string;
  phone: string;
  email: string;
  openingHours: string;
  features: {
    delivery: boolean;
    qrOrdering: boolean;
    reviews: boolean;
    onlinePayment: boolean;
  };
}

export interface WaiterNotification {
  id: string;
  tableNumber: number;
  type: 'call' | 'order' | 'bill';
  message: string;
  time: string;
  read: boolean;
}
