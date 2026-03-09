import { create } from 'zustand';
import type { Order, OrderStatus, OrderType, PaymentMethod } from '../types/order.types';
import type { CartItem } from '../types/menu.types';
import { createOrder as apiCreateOrder, fetchOrders } from '../lib/api';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;

  // actions
  loadOrders: () => Promise<void>;
  placeOrder: (params: {
    items: CartItem[];
    customerName: string;
    customerPhone: string;
    type: OrderType;
    tableNumber?: number;
    address?: string;
    paymentMethod: PaymentMethod;
  }) => Promise<Order>;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  activeOrder: null,
  loading: false,

  loadOrders: async () => {
    set({ loading: true });
    try {
      const orders = await fetchOrders();
      set({ orders, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  placeOrder: async (params) => {
    set({ loading: true });
    const total = params.items.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0,
    );
    const tax = Math.round(total * 0.05);

    const order = await apiCreateOrder({
      items: params.items.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.menuItem.price,
      })),
      type: params.type,
      tableNumber: params.tableNumber,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      address: params.address,
      paymentMethod: params.paymentMethod,
      total: total + tax,
    });

    set((state) => ({
      orders: [order, ...state.orders],
      activeOrder: order,
      loading: false,
    }));

    return order;
  },

  setActiveOrder: (order) => set({ activeOrder: order }),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o,
      ),
      activeOrder:
        state.activeOrder?.id === orderId
          ? { ...state.activeOrder, status }
          : state.activeOrder,
    })),
}));
