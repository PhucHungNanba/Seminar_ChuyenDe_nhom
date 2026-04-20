import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// --- Types ---
export interface CartItem {
  id: string
  name: string
  type: 'otc' | 'rx'       // OTC = over-the-counter | rx = prescription required
  price: number
  quantity: number
  imageUrl?: string
  prescription: {           // only for rx items
    fileUrl: string
    fileName: string
    uploadedAt: string
  } | null
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'prescription'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  setPrescription: (itemId: string, prescription: CartItem['prescription']) => void
  userPoints: number
  usePoints: boolean
  toggleUsePoints: () => void
  latestAddedItemId: string | null
  clearLatestAddedItem: () => void
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
          return { items: [...s.items, { ...item, prescription: null }], latestAddedItemId: item.id }
        }),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      // Map prescription 1-1 to specific cart item
      setPrescription: (itemId, prescription) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === itemId ? { ...i, prescription } : i
          ),
        })),

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'pharmacare-cart',   // localStorage key
      partialize: (state) => ({ items: state.items, usePoints: state.usePoints }),
    }
  )
)
