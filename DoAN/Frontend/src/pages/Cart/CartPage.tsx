import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, ArrowLeft, ShieldCheck,
  AlertTriangle, ChevronRight, Lock, CheckCircle2
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import CartItemCard from '../../components/cart/CartItem'
import FrequentlyBoughtTogether from '../../components/common/FrequentlyBoughtTogether'
import { getRulesForProducts } from '../../data/mockAssociationRules'

function formatVnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

export default function CartPage() {
  const items = useCartStore((s) => s.items)

  // Rx items that are still missing prescription
  const rxMissingPrescription = items.filter(
    (i) => i.type === 'rx' && !i.prescription
  )
  const canCheckout = rxMissingPrescription.length === 0

  const userPoints = useCartStore((s) => s.userPoints)
  const usePoints = useCartStore((s) => s.usePoints)
  const toggleUsePoints = useCartStore((s) => s.toggleUsePoints)

  // Order summary calculations
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingFee = subtotal >= 200000 ? 0 : 25000
  const discount = usePoints ? userPoints : 0
  const total = Math.max(0, subtotal + shippingFee - discount)

  // ── Empty cart ───────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="p-5 rounded-full bg-sky-50">
          <ShoppingCart className="w-12 h-12 text-sky-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Giỏ hàng trống</h2>
        <p className="text-slate-400 text-sm">Hãy thêm thuốc vào giỏ để tiếp tục mua sắm.</p>
        <Link
          to="/products"
          className="mt-2 px-6 py-2.5 rounded-full bg-sky-500 text-white font-medium
                     hover:bg-sky-600 transition-colors text-sm"
        >
          Xem danh mục thuốc
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 rounded-full hover:bg-sky-50 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Giỏ hàng</h1>
          <p className="text-sm text-slate-400">{items.length} sản phẩm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left: Cart items ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          {/* Rx warning banner (shows if any Rx item missing prescription) */}
          <AnimatePresence>
            {rxMissingPrescription.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200
                                rounded-2xl text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">
                      {rxMissingPrescription.length} thuốc Rx cần đơn thuốc
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Vui lòng tải đơn thuốc hợp lệ lên cho từng sản phẩm kê đơn để tiến hành thanh toán.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart item list */}
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-[#f5f5f7] rounded-[32px] p-8 sticky top-24">
            <h2 className="font-bold text-slate-900 text-xl mb-6 tracking-tight">Tóm tắt đơn hàng</h2>

            {/* Price rows */}
            <div className="flex flex-col gap-4 text-[15px]">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                <span className="font-semibold text-slate-700">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí giao hàng</span>
                {shippingFee === 0
                  ? <span className="text-emerald-600 font-medium">Miễn phí</span>
                  : <span className="font-medium">{formatVnd(shippingFee)}</span>
                }
              </div>
              {shippingFee > 0 && (
                <p className="text-[13px] text-sky-500 font-medium">
                  Mua thêm {formatVnd(200000 - subtotal)} để được miễn phí ship
                </p>
              )}

              {/* Vibe 4: Points Ecosystem */}
              <div className="mt-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-blue-800">Dùng điểm thưởng</p>
                  <p className="text-xs text-blue-600/80">Bạn có {formatVnd(userPoints)} điểm</p>
                </div>
                <button
                  onClick={toggleUsePoints}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${usePoints ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usePoints ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {usePoints && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Giảm giá điểm</span>
                  <span>-{formatVnd(userPoints)}</span>
                </div>
              )}

              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between font-bold text-slate-900 text-xl mt-2">
                <span>Tổng cộng</span>
                <span>{formatVnd(total)}</span>
              </div>
            </div>

            {/* Prescription status summary */}
            {items.some((i) => i.type === 'rx') && (
              <div className="mt-6 p-4 rounded-2xl bg-white/60">
                <p className="text-[13px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Trạng thái đơn thuốc:</p>
                <div className="flex flex-col gap-2">
                  {items.filter((i) => i.type === 'rx').map((rxItem) => (
                    <div key={rxItem.id} className="flex items-center gap-2 text-[13px]">
                      {rxItem.prescription
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        : <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      }
                      <span className={`truncate max-w-[160px] font-medium ${rxItem.prescription ? 'text-slate-700' : 'text-rose-600'}`}>
                        {rxItem.name}
                      </span>
                      <span className={`ml-auto font-bold shrink-0 ${rxItem.prescription ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {rxItem.prescription ? 'Đã tải' : 'Thiếu'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Checkout button (disabled if Rx missing) ── */}
            <div className="mt-5">
              <AnimatePresence mode="wait">
                {canCheckout ? (
                  /* ── UNLOCKED: pulse glow ring animation ── */
                  <motion.div
                    key="checkout-enabled"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 280 }}
                    className="relative"
                  >
                    {/* Outer glow ring — pulses continuously */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-sky-400 opacity-0"
                      animate={{
                        opacity: [0, 0.35, 0],
                        scale: [1, 1.06, 1],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <Link
                      id="btn-checkout"
                      to="/checkout"
                      className="relative flex items-center justify-center gap-2 w-full py-4 px-6
                                 rounded-full bg-black text-white text-[15px]
                                 font-bold hover:scale-[1.02] hover:bg-slate-800
                                 shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Tiến hành thanh toán
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-xs text-emerald-600 mt-2 font-medium"
                    >
                      ✓ Tất cả đơn thuốc đã sẵn sàng
                    </motion.p>
                  </motion.div>
                ) : (
                  /* ── LOCKED: greyed out + hint ── */
                  <motion.div
                    key="checkout-disabled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <button
                      id="btn-checkout-disabled"
                      disabled
                      className="flex items-center justify-center gap-2 w-full py-4 px-6
                                 rounded-full bg-slate-200 text-slate-400 font-bold
                                 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4" />
                      Thanh toán
                    </button>
                    <p className="text-center text-xs text-amber-600 mt-2">
                      Cần tải đơn thuốc cho {rxMissingPrescription.length} sản phẩm Rx
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Thanh toán bảo mật & an toàn</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Frequently Bought Together ── */}
      {/* associationRulesData: kết quả data mining từ BE, tạm dùng mock */}
      <FrequentlyBoughtTogether
        associationRulesData={getRulesForProducts(items.map((i) => i.id))}
        currentProductIds={items.map((i) => i.id)}
        title="Có thể bạn cũng cần"
        maxItems={8}
      />
    </div>
  )
}
