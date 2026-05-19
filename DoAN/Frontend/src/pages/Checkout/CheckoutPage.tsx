import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Phone, MapPin, FileText,
  Banknote, CreditCard, Building2, CheckCircle2,
  ShieldCheck, AlertTriangle, ChevronRight, Package
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import axiosClient from '../../api/axiosClient'
import TypeBadge from '../../components/common/TypeBadge'

// ── Types ──────────────────────────────────────────
type PaymentMethod = 'cod' | 'card' | 'transfer'

interface DeliveryForm {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  ward: string
  note: string
}

// ── Payment method options ──────────────────────────
const PAYMENT_OPTS: {
  id: PaymentMethod
  icon: React.ReactNode
  label: string
  desc: string
}[] = [
  {
    id: 'cod',
    icon: <Banknote className="w-5 h-5" />,
    label: 'Thanh toán khi nhận hàng',
    desc: 'COD — Trả tiền mặt cho nhân viên giao hàng',
  },
  {
    id: 'card',
    icon: <CreditCard className="w-5 h-5" />,
    label: 'Thẻ ngân hàng / VISA',
    desc: 'Visa, Mastercard, JCB — Thanh toán ngay lập tức',
  },
  {
    id: 'transfer',
    icon: <Building2 className="w-5 h-5" />,
    label: 'Chuyển khoản ngân hàng',
    desc: 'Chuyển khoản qua internet banking / QR Code',
  },
]

// ── Format VND ─────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

// ── Input field wrapper ─────────────────────────────
function Field({
  label, id, required, children
}: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Styled input ────────────────────────────────────
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                 text-slate-700 placeholder:text-slate-400
                 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100
                 transition-all duration-150"
    />
  )
}

// ── Styled select ───────────────────────────────────
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                 text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2
                 focus:ring-sky-100 transition-all duration-150 cursor-pointer"
    />
  )
}

// ══════════════════════════════════════════════════
export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)

  // ── Form state ──────────────────────────────────
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true, state: { from: { pathname: location.pathname } } })
    }
  }, [user, navigate, location])

  const [form, setForm] = useState<DeliveryForm>({
    fullName: user?.fullName || '', phone: '', email: user?.email || '',
    address: '', city: '', district: '', ward: '', note: '',
  })
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [submitted, setSubmitted] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string>('')
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryForm, string>>>({})

  function setField(key: keyof DeliveryForm, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  // ── Validation ──────────────────────────────────
  function validate() {
    const e: typeof errors = {}
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.match(/^(0|\+84)[0-9]{9}$/)) e.phone = 'Số điện thoại không hợp lệ'
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ'
    if (!form.city) e.city = 'Chọn tỉnh/thành phố'
    if (!form.district.trim()) e.district = 'Vui lòng nhập quận/huyện'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsPlacingOrder(true)
    setOrderError(null)

    try {
      const clearCart = useCartStore.getState().clearCart
      const orderPayload = {
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
        })),
        shippingAddress: `${form.address}, ${form.district}, ${form.city}`,
        paymentMethod: payment,
        customerName: form.fullName,
        customerPhone: form.phone,
        customerEmail: form.email,
        note: form.note,
      }

      const res: any = await axiosClient.post('/orders', orderPayload)
      // Interceptor đã unwrap: res = { success, message, data: order }
      const createdOrder = res?.data || res
      setOrderId(createdOrder?.orderCode || createdOrder?._id || createdOrder?.id || '')

      // Xóa giỏ hàng sau khi đặt hàng thành công
      clearCart()
      setSubmitted(true)
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 401 || status === 403) {
        setOrderError('Bạn cần đăng nhập để thực hiện thao tác này.')
        navigate('/auth', { replace: true, state: { from: { pathname: location.pathname } } })
      } else {
        const msg = err?.response?.data?.message || err?.data?.message || err?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại!'
        setOrderError(msg)
      }
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const userPoints = useCartStore((s) => s.userPoints)
  const usePoints = useCartStore((s) => s.usePoints)

  // ── Order summary values ─────────────────────────
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingFee = subtotal >= 200000 ? 0 : 25000
  const discount = usePoints ? userPoints : 0
  const total = Math.max(0, subtotal + shippingFee - discount)
  const rxItems = items.filter((i) => i.type === 'rx')
  const allRxVerified = rxItems.every((i) => i.prescription !== null)

  // ── Success screen ───────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
          className="p-5 rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="w-14 h-14 text-emerald-500" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Đặt hàng thành công!</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Cảm ơn bạn đã tin dùng PharmaCare. Đơn hàng của bạn đang được xử lý
            và sẽ được giao trong 2 giờ.
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 w-full text-sm text-left border border-slate-100">
          <p className="text-slate-400 mb-1">Mã đơn hàng</p>
          <p className="font-bold text-sky-600 text-lg font-mono">
            {orderId ? orderId : 'ĐANG XỬ LÝ'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">ID: {orderId || 'N/A'}</p>
          <p className="text-slate-400 mt-3 mb-1">Giao đến</p>
          <p className="font-medium text-slate-700">{form.fullName} · {form.phone}</p>
          <p className="text-slate-500">{form.address}, {form.district}, {form.city}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          <Link
            to={`/orders/${orderId}`}
            className="px-6 py-3 rounded-full bg-sky-500 text-white font-semibold text-sm
                       hover:bg-sky-600 transition-colors shadow-md hover:shadow-sky-200"
          >
            Theo dõi đơn hàng
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm
                       hover:bg-slate-50 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cart" className="p-2 rounded-full hover:bg-sky-50 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Thanh toán</h1>
          <p className="text-sm text-slate-400">Bước cuối cùng — kiểm tra và xác nhận đơn hàng</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ══ LEFT: Delivery form ════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Section: Delivery info */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                Thông tin nhận hàng
              </h2>

              {/* CSS Grid form layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Full name — full width */}
                <div className="sm:col-span-2">
                  <Field label="Họ và tên" id="fullName" required>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="fullName"
                        placeholder="Nguyễn Văn A"
                        value={form.fullName}
                        onChange={(e) => setField('fullName', e.target.value)}
                        className="pl-10"
                        style={{ paddingLeft: '2.25rem' }}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </Field>
                </div>

                {/* Phone */}
                <Field label="Số điện thoại" id="phone" required>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      placeholder="0901 234 567"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </Field>

                {/* Email */}
                <Field label="Email (tuỳ chọn)" id="email">
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                </Field>

                {/* Address — full width */}
                <div className="sm:col-span-2">
                  <Field label="Số nhà, tên đường" id="address" required>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="address"
                        placeholder="123 Nguyễn Trãi"
                        value={form.address}
                        onChange={(e) => setField('address', e.target.value)}
                        style={{ paddingLeft: '2.25rem' }}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                    )}
                  </Field>
                </div>

                {/* City */}
                <Field label="Tỉnh / Thành phố" id="city" required>
                  <Select
                    id="city"
                    value={form.city}
                    onChange={(e) => setField('city', e.target.value)}
                  >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                  )}
                </Field>

                {/* District */}
                <Field label="Quận / Huyện" id="district" required>
                  <Input
                    id="district"
                    placeholder="Quận 1"
                    value={form.district}
                    onChange={(e) => setField('district', e.target.value)}
                  />
                  {errors.district && (
                    <p className="text-xs text-red-500 mt-1">{errors.district}</p>
                  )}
                </Field>

                {/* Ward */}
                <Field label="Phường / Xã" id="ward">
                  <Input
                    id="ward"
                    placeholder="Phường Bến Nghé"
                    value={form.ward}
                    onChange={(e) => setField('ward', e.target.value)}
                  />
                </Field>

                {/* Note — full width */}
                <div className="sm:col-span-2">
                  <Field label="Ghi chú cho tài xế" id="note">
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        id="note"
                        rows={2}
                        placeholder="Giao giờ hành chính, gọi trước 15 phút..."
                        value={form.note}
                        onChange={(e) => setField('note', e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white
                                   text-sm text-slate-700 placeholder:text-slate-400 resize-none
                                   focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100
                                   transition-all duration-150"
                        style={{ paddingLeft: '2.25rem' }}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </section>

            {/* Section: Payment method */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                Phương thức thanh toán
              </h2>

              <div className="flex flex-col gap-3">
                {PAYMENT_OPTS.map((opt) => {
                  const active = payment === opt.id
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      id={`pay-${opt.id}`}
                      onClick={() => setPayment(opt.id)}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left
                                  transition-all duration-200 cursor-pointer
                                  ${active
                                    ? 'border-sky-400 bg-sky-50 shadow-sm shadow-sky-100'
                                    : 'border-slate-200 hover:border-sky-200 hover:bg-sky-50/40'
                                  }`}
                    >
                      {/* Icon circle */}
                      <div className={`p-2.5 rounded-full transition-colors shrink-0
                                      ${active ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {opt.icon}
                      </div>

                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${active ? 'text-sky-700' : 'text-slate-700'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>

                      {/* Active indicator */}
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="shrink-0"
                          >
                            <CheckCircle2 className="w-5 h-5 text-sky-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ══ RIGHT: Order summary (sticky) ══════════ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-500" />
                Đơn hàng của bạn
              </h2>

              {/* Item list */}
              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {/* Thumb */}
                    <img
                      src={item.imageUrl || 'https://placehold.co/48x48/e0f2fe/0ea5e9?text=💊'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 leading-tight truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <TypeBadge type={item.type} size="sm" />
                        <span className="text-xs text-slate-400">×{item.quantity}</span>
                      </div>

                      {/* Prescription status for Rx items */}
                      {item.type === 'rx' && (
                        <div className={`flex items-center gap-1 text-xs mt-1 font-medium
                                        ${item.prescription ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {item.prescription
                            ? <><CheckCircle2 className="w-3 h-3" /> Đơn thuốc đã xác nhận</>
                            : <><AlertTriangle className="w-3 h-3" /> Chưa có đơn thuốc</>
                          }
                        </div>
                      )}
                    </div>

                    {/* Line price */}
                    <p className="text-sm font-semibold text-slate-700 shrink-0">
                      {fmt(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-slate-100 mb-4" />

              {/* Price summary */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phí giao hàng</span>
                  {shippingFee === 0
                    ? <span className="text-emerald-600 font-medium">Miễn phí</span>
                    : <span>{fmt(shippingFee)}</span>
                  }
                </div>
                {usePoints && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Giảm giá điểm</span>
                    <span>-{fmt(userPoints)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-800 text-base pt-2
                                border-t border-slate-100 mt-1">
                  <span>Tổng cộng</span>
                  <span className="text-sky-600">{fmt(total)}</span>
                </div>
              </div>

              {/* Payment badge */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-sky-50
                              rounded-xl border border-sky-100 text-xs text-sky-700 font-medium">
                {PAYMENT_OPTS.find((o) => o.id === payment)?.icon}
                <span>{PAYMENT_OPTS.find((o) => o.id === payment)?.label}</span>
              </div>

              {/* Rx verification warning */}
              {!allRxVerified && rxItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200
                             rounded-xl text-xs text-amber-700"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Một số thuốc Rx chưa có đơn thuốc. Vui lòng quay lại giỏ hàng để upload.</span>
                </motion.div>
              )}

              {/* Order error banner */}
              {orderError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{orderError}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                id="btn-place-order"
                type="submit"
                disabled={isPlacingOrder}
                whileTap={{ scale: 0.97 }}
                className={`mt-5 w-full flex items-center justify-center gap-2 py-3 px-6
                           rounded-xl text-white font-semibold text-sm shadow-md transition-all
                           ${isPlacingOrder
                             ? 'bg-sky-400 cursor-wait'
                             : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 hover:shadow-sky-200'
                           }`}
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Đang đặt hàng...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Đặt hàng ngay
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Thanh toán bảo mật & an toàn
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
