import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Phone, MapPin, Clock, Star,
  Bike, MessageCircle, ShieldCheck,
  Receipt, ChevronRight, FileText, CheckCircle2
} from 'lucide-react'
import StepperProgress, { StepKey, ORDER_STEPS } from '../../components/order/StepperProgress'
import TypeBadge from '../../components/common/TypeBadge'

// ── Mock order data ─────────────────────────────────
export interface MockOrder {
  id: string
  status: StepKey
  createdAt: string
  estimatedDelivery: string
  items: {
    id: string; name: string; type: 'otc' | 'rx'
    quantity: number; price: number
    imageUrl: string
    prescriptionUrl?: string
  }[]
  delivery: {
    name: string
    phone: string
    vehicle: 'bike' | 'motorbike'
    plate: string
    rating: number
    avatarUrl: string
    eta: string           // "10 phút nữa"
    address: string
  }
  payment: 'cod' | 'card' | 'transfer'
  total: number
}

export const MOCK_ORDERS: Record<string, MockOrder> = {
  'ORD-001': {
    id: 'ORD-001',
    status: 'shipping',
    createdAt: '2026-04-19T10:30:00',
    estimatedDelivery: '2026-04-19T12:30:00',
    items: [
      { id: 'rx-001', name: 'Amoxicillin 500mg', type: 'rx', quantity: 2, price: 85000,
        imageUrl: 'https://placehold.co/56x56/fef3c7/f59e0b?text=Rx',
        prescriptionUrl: 'https://placehold.co/120x80/d1fae5/10b981?text=Đơn+thuốc' },
      { id: 'otc-001', name: 'Paracetamol 500mg', type: 'otc', quantity: 1, price: 25000,
        imageUrl: 'https://placehold.co/56x56/e0f2fe/0ea5e9?text=OTC' },
    ],
    delivery: {
      name: 'Nguyễn Minh Khoa',
      phone: '0901 234 567',
      vehicle: 'motorbike',
      plate: '51F1 - 23456',
      rating: 4.9,
      avatarUrl: 'https://placehold.co/48x48/bfdbfe/1d4ed8?text=NMK',
      eta: '8 phút nữa',
      address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    },
    payment: 'cod',
    total: 195000,
  },
  'ORD-002': {
    id: 'ORD-002',
    status: 'packing',
    createdAt: '2026-04-19T11:00:00',
    estimatedDelivery: '2026-04-19T13:00:00',
    items: [
      { id: 'rx-002', name: 'Metformin 850mg', type: 'rx', quantity: 2, price: 120000,
        imageUrl: 'https://placehold.co/56x56/fef3c7/f59e0b?text=Rx',
        prescriptionUrl: 'https://placehold.co/120x80/d1fae5/10b981?text=Đơn+thuốc' },
    ],
    delivery: {
      name: 'Trần Thị Lan',
      phone: '0912 345 678',
      vehicle: 'bike',
      plate: 'N/A',
      rating: 4.7,
      avatarUrl: 'https://placehold.co/48x48/fce7f3/be185d?text=TTL',
      eta: '~30 phút',
      address: '45 Lê Lợi, Quận 3, TP.HCM',
    },
    payment: 'transfer',
    total: 240000,
  },
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

// ── Step switcher (demo only) ───────────────────────
const STEPS_LIST: StepKey[] = ['pending', 'packing', 'shipping', 'done']

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const order = MOCK_ORDERS[id ?? ''] ?? MOCK_ORDERS['ORD-001']

  // Demo: allow clicking through steps
  const [demoStep, setDemoStep] = useState<StepKey>(order.status)
  const currentIdx = STEPS_LIST.indexOf(demoStep)
  const isShipping = demoStep === 'shipping' || demoStep === 'done'

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders/ORD-001" className="p-2 rounded-full hover:bg-sky-50 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Theo dõi đơn hàng</h1>
          <p className="text-sm text-slate-400 font-mono">{order.id}</p>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold
            ${demoStep === 'done' ? 'bg-emerald-100 text-emerald-700' :
              demoStep === 'shipping' ? 'bg-sky-100 text-sky-700' :
              'bg-amber-100 text-amber-700'}`}>
            {ORDER_STEPS[STEPS_LIST.indexOf(demoStep)].label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ══ LEFT: Tracking card (2/3 width) ════════ */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Stepper card */}
          <motion.section
            layout
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800">Trạng thái đơn hàng</h2>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Đặt lúc {fmtTime(order.createdAt)}</span>
              </div>
            </div>

            <StepperProgress currentStep={demoStep} />

            {/* ETA bar */}
            {demoStep !== 'done' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 flex items-center justify-between text-sm px-1"
              >
                <span className="text-slate-400 text-xs">Đặt hàng {fmtTime(order.createdAt)}</span>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  Dự kiến: {fmtTime(order.estimatedDelivery)}
                </div>
              </motion.div>
            )}

            {/* Demo step controls */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Demo:</span>
              {STEPS_LIST.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setDemoStep(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                    ${demoStep === s
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.section>

          {/* ── Delivery person box ── */}
          <AnimatePresence>
            {isShipping && (
              <motion.section
                key="delivery-box"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden"
              >
                {/* Sky header strip */}
                <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-5 py-3 flex items-center gap-2">
                  <Bike className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">Thông tin người giao hàng</span>
                  <div className="ml-auto flex items-center gap-1 bg-white/20 rounded-full px-3 py-0.5">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">{order.delivery.eta}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={order.delivery.avatarUrl}
                        alt={order.delivery.name}
                        className="w-14 h-14 rounded-full border-2 border-sky-200 object-cover"
                      />
                      {/* Online dot */}
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500
                                       rounded-full border-2 border-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800">{order.delivery.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-amber-600">{order.delivery.rating}</span>
                        <span className="text-xs text-slate-400 ml-1">· Đánh giá xuất sắc</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Bike className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500 font-mono font-medium">
                          {order.delivery.plate}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <a
                        href={`tel:${order.delivery.phone}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500
                                   hover:bg-sky-600 text-white text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Gọi ngay
                      </a>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100
                                         hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Nhắn tin
                      </button>
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div className="mt-4 flex items-start gap-2 p-3 bg-slate-50 rounded-xl
                                   border border-slate-100">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Giao đến</p>
                      <p className="text-sm font-medium text-slate-700">{order.delivery.address}</p>
                    </div>
                    <div className="ml-auto shrink-0 text-right">
                      <p className="text-xs text-slate-400">Dự kiến</p>
                      <p className="text-sm font-bold text-emerald-600">{order.delivery.eta}</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ══ RIGHT: Order detail sidebar ════════════ */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Order items */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-500" />
              Sản phẩm đã đặt
            </h2>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.imageUrl} alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 leading-tight truncate">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <TypeBadge type={item.type} size="sm" />
                      <span className="text-xs text-slate-400">×{item.quantity}</span>
                    </div>

                    {/* Linked prescription for Rx items */}
                    {item.type === 'rx' && item.prescriptionUrl && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <img src={item.prescriptionUrl} alt="Đơn thuốc"
                          className="w-10 h-6 rounded object-cover border border-emerald-200" />
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Đơn thuốc đã xác nhận
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 shrink-0">
                    {fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-100 my-3" />
            <div className="flex justify-between font-bold text-slate-800 text-sm">
              <span>Tổng cộng</span>
              <span className="text-sky-600">{fmt(order.total)}</span>
            </div>
          </section>

          {/* Confirmation info */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Xác nhận & Bảo mật
            </h2>
            <ul className="flex flex-col gap-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Đơn thuốc được kiểm duyệt bởi dược sĩ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Thông tin y tế được bảo mật tuyệt đối
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Đổi/trả trong 24h nếu có sai sót
              </li>
            </ul>
          </section>

          {/* View full order */}
          <Link to="/orders/ORD-001"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                       border border-slate-200 text-slate-600 text-sm font-medium
                       hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all">
            <FileText className="w-4 h-4" />
            Lịch sử đơn hàng
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
