import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// --- Types ---
export interface CartItem {
  id: string
  name: string
  type: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device'
  price: number
  quantity: number
  imageUrl?: string
  quotedByPharmacist?: boolean  // true = pushed by pharmacist after Rx approval
  prescription: {
    fileUrl: string
    fileName: string
    uploadedAt: string
  } | null
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'prescription' | 'quotedByPharmacist'>) => void
  /** Called when pharmacist approves Rx and backend creates the quoted order */
  addQuotedRxItems: (items: Array<Omit<CartItem, 'prescription' | 'type' | 'quotedByPharmacist'>>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  setPrescription: (itemId: string, prescription: CartItem['prescription']) => void
  userPoints: number
  usePoints: boolean
  toggleUsePoints: () => void
  latestAddedItemId: string | null
  clearLatestAddedItem: () => void
  clearCart: () => void
  totalCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userPoints: 15000,
      usePoints: false,
      latestAddedItemId: null,

      toggleUsePoints: () => set((s) => ({ usePoints: !s.usePoints })),
      clearLatestAddedItem: () => set({ latestAddedItemId: null }),
      clearCart: () => set({ items: [], latestAddedItemId: null }),

      addItem: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === item.id)
          if (exists) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              latestAddedItemId: item.id
            }
          }
          return {
            items: [...s.items, { ...item, prescription: null, quotedByPharmacist: false }],
            latestAddedItemId: item.id
          }
        }),

      /**
       * Pharmacist push: inject Rx items that have been approved.
       * Sets quotedByPharmacist = true so CartItem locks the quantity.
       */
      addQuotedRxItems: (incoming) =>
        set((s) => {
          const nextItems = [...s.items]
          incoming.forEach((rx) => {
            const index = nextItems.findIndex((i) => i.id === rx.id)
            const normalized: CartItem = {
              ...rx,
              type: 'rx' as const,
              prescription: null,
              quotedByPharmacist: true,
            }
            if (index >= 0) {
              nextItems[index] = { ...nextItems[index], ...normalized }
            } else {
              nextItems.push(normalized)
            }
          })
          return { items: nextItems }
        }),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      setPrescription: (itemId, prescription) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === itemId ? { ...i, prescription } : i
          ),
        })),

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'pharmacare-cart',
      partialize: (state) => ({ items: state.items, usePoints: state.usePoints }),
    }
  )
)
