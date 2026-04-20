import { create } from 'zustand'

export interface RxRequest {
  id: string
  phone: string
  symptoms: string
  fileUrl: string | null
  status: 'DRAFT_RX' | 'PENDING_PAYMENT' | 'COMPLETED'
  createdAt: string
}

interface RxStore {
  rxRequests: RxRequest[]
  addRequest: (req: Omit<RxRequest, 'id' | 'createdAt' | 'status'>) => void
}

export const useRxStore = create<RxStore>((set) => ({
  rxRequests: [],
  addRequest: (req) =>
    set((s) => ({
      rxRequests: [
        {
          ...req,
          id: `RX-REQ-${Math.floor(Math.random() * 10000)}`,
          status: 'DRAFT_RX',
          createdAt: new Date().toISOString(),
        },
        ...s.rxRequests,
      ],
    })),
}))
