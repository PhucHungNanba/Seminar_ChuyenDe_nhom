import { create } from 'zustand';
import { MOCK_RX_REQUESTS, RxRequest } from '../data/mockRxRequests';
import { mockInventory, InventoryItem } from '../data/mockInventory';

export type StockLocationType = keyof InventoryItem['stockLocations'];

interface AdminState {
  // Rx Approval
  rxRequests: RxRequest[];
  selectedRequest: RxRequest | null;
  builderItems: Array<{ id: string; name: string; quantity: number; price: number }>;
  
  selectRequest: (req: RxRequest | null) => void;
  addBuilderItem: (item: { id: string; name: string; price: number }) => void;
  removeBuilderItem: (id: string) => void;
  updateBuilderItemQty: (id: string, qty: number) => void;
  clearBuilder: () => void;
  
  approveRx: (id: string) => void;
  rejectRx: (id: string) => void;

  // Inventory
  inventory: InventoryItem[];
  updateStock: (productId: string, branch: StockLocationType, newQuantity: number) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  rxRequests: MOCK_RX_REQUESTS,
  selectedRequest: null,
  builderItems: [],

  selectRequest: (req) => set({ selectedRequest: req, builderItems: [] }),
  
  addBuilderItem: (item) => set((state) => {
    const existing = state.builderItems.find(i => i.id === item.id);
    if (existing) {
      return {
        builderItems: state.builderItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { builderItems: [...state.builderItems, { ...item, quantity: 1 }] };
  }),

  removeBuilderItem: (id) => set((state) => ({
    builderItems: state.builderItems.filter(i => i.id !== id)
  })),

  updateBuilderItemQty: (id, qty) => set((state) => ({
    builderItems: state.builderItems.map(i => 
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
    )
  })),

  clearBuilder: () => set({ builderItems: [], selectedRequest: null }),

  approveRx: (id) => {
    const { builderItems } = get();
    const totalAmount = builderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    set((state) => ({
      rxRequests: state.rxRequests.map(req => 
        req.id === id ? { ...req, status: 'APPROVED', totalAmount } : req
      ),
      selectedRequest: null,
      builderItems: []
    }));
  },

  rejectRx: (id) => set((state) => ({
    rxRequests: state.rxRequests.map(req => 
      req.id === id ? { ...req, status: 'REJECTED' } : req
    ),
    selectedRequest: null,
    builderItems: []
  })),

  inventory: mockInventory,
  updateStock: (productId, branch, newQuantity) => set((state) => ({
    inventory: state.inventory.map((item) => {
      if (item.id === productId) {
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
  }))
}));
