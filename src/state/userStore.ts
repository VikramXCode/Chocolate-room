import { create } from 'zustand';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  addresses: SavedAddress[];
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface UserState {
  profile: UserProfile;
  isLoggedIn: boolean;
  tableNumber: number | null;

  // actions
  setProfile: (p: Partial<UserProfile>) => void;
  login: (name: string, phone: string) => void;
  logout: () => void;
  setTableNumber: (n: number | null) => void;
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    name: 'Guest',
    phone: '',
    email: '',
    addresses: [
      {
        id: 'a1',
        label: 'Home',
        address: '45 Anna Nagar, Tirupur, Tamil Nadu 641601',
        isDefault: true,
      },
      {
        id: 'a2',
        label: 'Office',
        address: '12 Kamaraj Nagar, Tirupur, Tamil Nadu 641604',
        isDefault: false,
      },
    ],
  },
  isLoggedIn: false,
  tableNumber: null,

  setProfile: (p) =>
    set((s) => ({ profile: { ...s.profile, ...p } })),

  login: (name, phone) =>
    set((s) => ({
      isLoggedIn: true,
      profile: { ...s.profile, name, phone },
    })),

  logout: () =>
    set({
      isLoggedIn: false,
      profile: { name: 'Guest', phone: '', email: '', addresses: [] },
      tableNumber: null,
    }),

  setTableNumber: (n) => set({ tableNumber: n }),

  addAddress: (addr) =>
    set((s) => ({
      profile: {
        ...s.profile,
        addresses: [
          ...s.profile.addresses,
          { ...addr, id: `a${Date.now()}` },
        ],
      },
    })),

  removeAddress: (id) =>
    set((s) => ({
      profile: {
        ...s.profile,
        addresses: s.profile.addresses.filter((a) => a.id !== id),
      },
    })),

  setDefaultAddress: (id) =>
    set((s) => ({
      profile: {
        ...s.profile,
        addresses: s.profile.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      },
    })),
}));
