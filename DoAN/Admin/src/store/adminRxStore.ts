import { create } from 'zustand';

export type RxStatus = 'pending' | 'processing' | 'approved' | 'rejected';

export interface RxRequest {
  id: string;
  createdAt: string;
  customerPhone: string;
  customerName: string;
  imageUrl: string;
  status: RxStatus;
  totalAmount?: number;
}

export interface AdminRxState {
  requests: RxRequest[];
  selectedRequest: RxRequest | null;
  builderItems: Array<{ id: string; name: string; quantity: number; price: number }>;
  
  selectRequest: (req: RxRequest | null) => void;
  addBuilderItem: (item: { id: string; name: string; price: number }) => void;
  removeBuilderItem: (id: string) => void;
  updateBuilderItemQty: (id: string, qty: number) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  clearBuilder: () => void;
}

const MOCK_REQUESTS: RxRequest[] = [
  {
    id: 'RX-1001',
    createdAt: '2023-10-27 08:30',
    customerPhone: '0901234567',
    customerName: 'Nguyễn Văn A',
    imageUrl: 'https://placehold.co/600x800/e2e8f0/475569?text=Prescription+1',
    status: 'pending',
  },
  {
    id: 'RX-1002',
    createdAt: '2023-10-27 09:15',
    customerPhone: '0912345678',
    customerName: 'Trần Thị B',
    imageUrl: 'https://placehold.co/600x800/e2e8f0/475569?text=Prescription+2',
    status: 'pending',
  },
  {
    id: 'RX-1003',
    createdAt: '2023-10-26 15:45',
    customerPhone: '0987654321',
    customerName: 'Lê Văn C',
    imageUrl: 'https://placehold.co/600x800/e2e8f0/475569?text=Prescription+3',
    status: 'approved',
    totalAmount: 250000,
  },
];

export const useAdminRxStore = create<AdminRxState>((set, get) => ({
  requests: MOCK_REQUESTS,
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

  approveRequest: (id) => {
    const { builderItems } = get();
    const totalAmount = builderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    set((state) => ({
      requests: state.requests.map(req => 
        req.id === id ? { ...req, status: 'approved', totalAmount } : req
      ),
      selectedRequest: null,
      builderItems: []
    }));
  },

  rejectRequest: (id) => set((state) => ({
    requests: state.requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ),
    selectedRequest: null,
    builderItems: []
  })),

  clearBuilder: () => set({ builderItems: [], selectedRequest: null })
}));
