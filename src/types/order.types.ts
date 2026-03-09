export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export type OrderType = 'dine-in' | 'delivery' | 'takeaway';
export type PaymentMethod = 'upi' | 'card' | 'cash';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
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
  estimatedTime?: number; // minutes
}
