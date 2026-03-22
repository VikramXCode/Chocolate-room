export type MenuCategory =
  | 'Hot Chocolate'
  | 'Cold Beverages'
  | 'Desserts'
  | 'Cakes'
  | 'Snacks'
  | 'Shakes'
  | 'Waffles'
  | 'Specials';

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
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
