import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Order, MenuItem, Table, Review, WaiterNotification, CafeSettings } from '../types';
import { mockOrders, mockMenuItems, mockTables, mockReviews, mockNotifications, mockSettings } from '../data/mockData';

interface AppDataContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  notifications: WaiterNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<WaiterNotification[]>>;
  settings: CafeSettings;
  setSettings: React.Dispatch<React.SetStateAction<CafeSettings>>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [notifications, setNotifications] = useState<WaiterNotification[]>(mockNotifications);
  const [settings, setSettings] = useState<CafeSettings>(mockSettings);

  return (
    <AppDataContext.Provider value={{ orders, setOrders, menuItems, setMenuItems, tables, setTables, reviews, setReviews, notifications, setNotifications, settings, setSettings }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
