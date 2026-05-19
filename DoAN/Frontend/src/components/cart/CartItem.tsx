import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, Lock } from 'lucide-react'
import { useCartStore, CartItem as CartItemType } from '../../store/cartStore'

interface Props {
  item: CartItemType
}

function formatVnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

export default function CartItem({ item }: Props) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const isQuotedRx = item.type === 'rx' && (item as any).quotedByPharmacist === true

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-[24px] p-5 shadow-sm transition-colors border ${isQuotedRx ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}
    >
      <div className="flex gap-5">

        {/* Product image */}
        <div className="shrink-0 bg-[#f5f5f7] rounded-[20px] p-2 flex items-center justify-center w-24 h-24">
          <img
            src={item.imageUrl || 'https://placehold.co/80x80/e0f2fe/0ea5e9?text=💊'}
            alt={item.name}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {item.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                {item.type === 'rx' ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500" title="Thuốc kê đơn (Rx)" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Thuốc OTC" />
                )}
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  {item.type === 'rx' ? 'Kê đơn' : 'OTC'}
                </span>
                {isQuotedRx && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    <Lock className="w-2.5 h-2.5" />
                    Dược sĩ xác nhận
                  </span>
                )}
              </div>
            </div>
            {/* Remove btn */}
            <button
              id={`remove-item-${item.id}`}
              onClick={() => removeItem(item.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500
                         hover:bg-red-50 transition-colors shrink-0"
              title="Xóa sản phẩm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Price + Quantity row */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-slate-900 font-bold text-lg tracking-tight">
              {formatVnd(item.price * item.quantity)}
            </p>

            {isQuotedRx ? (
              /* Quoted Rx: lock quantity */
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
                <Lock className="w-3 h-3 text-amber-500" />
                <span className="text-[14px] font-bold text-amber-700">SL: {item.quantity}</span>
              </div>
            ) : (
              /* OTC: normal stepper */
              <div className="flex items-center gap-3 bg-[#f5f5f7] rounded-full px-1.5 py-1.5">
                <button
                  id={`qty-dec-${item.id}`}
                  onClick={() => item.quantity > 1
                    ? updateQuantity(item.id, item.quantity - 1)
                    : removeItem(item.id)
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full
                             hover:bg-white text-slate-600 hover:text-black transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-[15px] font-bold text-slate-900 w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  id={`qty-inc-${item.id}`}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full
                             hover:bg-white text-slate-600 hover:text-black transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
