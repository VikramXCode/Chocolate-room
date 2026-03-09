import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem, MenuItem, Order, OrderType, PaymentMethod } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  orders: Order[];
  placeOrder: (details: { customerName: string; customerPhone: string; type: OrderType; tableNumber?: number; address?: string; paymentMethod: PaymentMethod }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addItem = (menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) return prev.map((i) => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) { removeItem(itemId); return; }
    setItems((prev) => prev.map((i) => i.menuItem.id === itemId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = (details: { customerName: string; customerPhone: string; type: OrderType; tableNumber?: number; address?: string; paymentMethod: PaymentMethod }) => {
    const order: Order = {
      id: `o${Date.now()}`,
      items: items.map((i) => ({ menuItemId: i.menuItem.id, name: i.menuItem.name, quantity: i.quantity, price: i.menuItem.price })),
      status: 'pending',
      type: details.type,
      tableNumber: details.tableNumber,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      address: details.address,
      paymentMethod: details.paymentMethod,
      total,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, orders, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
