/**
 * Simulated API layer — drop-in replaceable with real fetch calls later.
 * Every function returns a Promise to mirror real async API behaviour.
 */
import type { MenuItem } from '../types/menu.types';
import type { Order } from '../types/order.types';
import type { Review } from '../types/review.types';

import menuData from '../data/menu.json';
import reviewsData from '../data/reviews.json';
import ordersData from '../data/orders.json';
import tablesData from '../data/tables.json';

// ---------- helpers ----------
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ---------- Menu ----------
export async function fetchMenu(): Promise<MenuItem[]> {
  await delay(300);
  return menuData as MenuItem[];
}

export async function fetchMenuItemById(id: string): Promise<MenuItem | undefined> {
  await delay(150);
  return (menuData as MenuItem[]).find((i) => i.id === id);
}

// ---------- Orders ----------
export async function fetchOrders(): Promise<Order[]> {
  await delay(350);
  return ordersData as Order[];
}

export async function createOrder(
  order: Omit<Order, 'id' | 'createdAt' | 'status'>,
): Promise<Order> {
  await delay(600);
  const created: Order = {
    ...order,
    id: `o${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedTime: 20,
  };
  return created;
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
  await delay(200);
  return (ordersData as Order[]).find((o) => o.id === id);
}

// ---------- Reviews ----------
export async function fetchReviews(): Promise<Review[]> {
  await delay(300);
  return reviewsData as Review[];
}

export async function submitReview(
  review: Omit<Review, 'id' | 'date'>,
): Promise<Review> {
  await delay(500);
  return {
    ...review,
    id: `r${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  };
}

// ---------- Tables ----------
export interface TableInfo {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  assignedWaiter?: string;
  currentOrderId?: string;
}

export async function fetchTables(): Promise<TableInfo[]> {
  await delay(200);
  return tablesData as TableInfo[];
}

export async function fetchTableById(
  tableId: string,
): Promise<TableInfo | undefined> {
  await delay(150);
  return (tablesData as TableInfo[]).find(
    (t) => t.id === tableId || t.number.toString() === tableId,
  );
}

// ---------- Waiter Call ----------
export async function callWaiter(tableNumber: number): Promise<{ success: boolean }> {
  await delay(400);
  console.log(`[API] Waiter called for table ${tableNumber}`);
  return { success: true };
}
