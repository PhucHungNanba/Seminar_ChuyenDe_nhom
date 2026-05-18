import { create } from 'zustand';
import { InventoryItem, RxRequest } from '../types';
import axiosClient from '../api/axiosClient';

export type StockLocationType = keyof InventoryItem['stockLocations'];

interface AdminState {
  rxRequests: RxRequest[];
  isLoadingRx: boolean;
  rxError: string | null;
  fetchRxRequests: () => Promise<void>;

  selectedRequest: RxRequest | null;
  builderItems: Array<{ _id: string; name: string; quantity: number; price: number }>;
  
  selectRequest: (req: RxRequest | null) => void;
  addBuilderItem: (item: { _id: string; name: string; price: number }) => void;
  removeBuilderItem: (id: string) => void;
  updateBuilderItemQty: (id: string, qty: number) => void;
  clearBuilder: () => void;
  
  approveRx: (id: string) => Promise<void>;
  rejectRx: (id: string) => Promise<void>;

  inventory: InventoryItem[];
  isLoadingInventory: boolean;
  inventoryError: string | null;
  fetchInventory: () => Promise<void>;
  updateStock: (productId: string, branch: StockLocationType, newQuantity: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  rxRequests: [],
  isLoadingRx: false,
  rxError: null,

  fetchRxRequests: async () => {
    set({ isLoadingRx: true, rxError: null });
    try {
      const response: any = await axiosClient.get('/orders/prescriptions/requests');
      set({ rxRequests: response.data || response || [], isLoadingRx: false });
    } catch (error: any) {
      set({ rxError: error.message || 'Lỗi khi tải yêu cầu', isLoadingRx: false });
    }
  },

  selectedRequest: null,
  builderItems: [],

  selectRequest: (req) => set({ selectedRequest: req, builderItems: [] }),
  
  addBuilderItem: (item) => set((state) => {
    const existing = state.builderItems.find(i => i._id === item._id);
    if (existing) {
      return {
        builderItems: state.builderItems.map(i => 
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { builderItems: [...state.builderItems, { ...item, quantity: 1 }] };
  }),

  removeBuilderItem: (id) => set((state) => ({
    builderItems: state.builderItems.filter(i => i._id !== id)
  })),

  updateBuilderItemQty: (id, qty) => set((state) => ({
    builderItems: state.builderItems.map(i => 
      i._id === id ? { ...i, quantity: Math.max(1, qty) } : i
    )
  })),

  clearBuilder: () => set({ builderItems: [], selectedRequest: null }),

  approveRx: async (id) => {
    const { builderItems } = get();
    const totalAmount = builderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    try {
      await axiosClient.post(`/orders/prescriptions/${id}/approve`, { items: builderItems, totalAmount });
      set((state) => ({
        rxRequests: state.rxRequests.map(req => 
          req._id === id ? { ...req, status: 'APPROVED', totalAmount } : req
        ),
        selectedRequest: null,
        builderItems: []
      }));
    } catch (error) {
      console.error(error);
    }
  },

  rejectRx: async (id) => {
    try {
      await axiosClient.post(`/orders/prescriptions/${id}/reject`);
      set((state) => ({
        rxRequests: state.rxRequests.map(req => 
          req._id === id ? { ...req, status: 'REJECTED' } : req
        ),
        selectedRequest: null,
        builderItems: []
      }));
    } catch (error) {
      console.error(error);
    }
  },

  inventory: [],
  isLoadingInventory: false,
  inventoryError: null,

  fetchInventory: async () => {
    set({ isLoadingInventory: true, inventoryError: null });
    try {
      const response: any = await axiosClient.get('/products/inventory');
      set({ inventory: response.data || response || [], isLoadingInventory: false });
    } catch (error: any) {
      set({ inventoryError: error.message || 'Lỗi tải kho', isLoadingInventory: false });
    }
  },

  updateStock: async (productId, branch, newQuantity) => {
    try {
      await axiosClient.put(`/products/inventory/${productId}`, { branch, quantity: newQuantity });
      set((state) => ({
        inventory: state.inventory.map((item) => {
          if (item._id === productId) {
            return {
              ...item,
              stockLocations: {
                ...item.stockLocations,
                [branch]: newQuantity
              }
            };
          }
          return item;
        })
      }));
    } catch (error) {
      console.error(error);
    }
  }
}));
