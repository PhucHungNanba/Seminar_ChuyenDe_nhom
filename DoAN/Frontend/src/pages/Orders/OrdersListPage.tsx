import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import axiosClient from '../../api/axiosClient'
import { Package, Clock, ChevronRight, FileText, CheckCircle2, XCircle, AlertCircle, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function fmt(n: number) {
  if (n === undefined || n === null) return '0đ'
  return n.toLocaleString('vi-VN') + 'đ'
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const ORDER_STATUS: Record<string, { label: string; colorClass: string }> = {
  UNPAID:     { label: 'Chờ thanh toán', colorClass: 'bg-amber-100 text-amber-700' },
  PAID:       { label: 'Đã thanh toán',  colorClass: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Đang chuẩn bị',  colorClass: 'bg-indigo-100 text-indigo-700' },
  SHIPPED:    { label: 'Đang giao',      colorClass: 'bg-sky-100 text-sky-700' },
  COMPLETED:  { label: 'Hoàn thành',     colorClass: 'bg-emerald-100 text-emerald-700' },
  CANCELLED:  { label: 'Đã hủy',         colorClass: 'bg-red-100 text-red-700' },
  // legacy
  pending:    { label: 'Chờ xác nhận',   colorClass: 'bg-amber-100 text-amber-700' },
  approved:   { label: 'Đã duyệt',       colorClass: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Đang giao',      colorClass: 'bg-sky-100 text-sky-700' },
}

const RX_STATUS: Record<string, { label: string; icon: React.ReactNode; colorClass: string }> = {
  PENDING:  { label: 'Đang chờ dược sĩ duyệt', icon: <AlertCircle className="w-4 h-4" />, colorClass: 'bg-amber-100 text-amber-700 border-amber-200' },
  APPROVED: { label: 'Đã được duyệt — Kiểm tra giỏ hàng', icon: <CheckCircle2 className="w-4 h-4" />, colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Đơn thuốc bị từ chối', icon: <XCircle className="w-4 h-4" />, colorClass: 'bg-red-100 text-red-700 border-red-200' },
}

export default function OrdersListPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const addQuotedRxItems = useCartStore((s) => s.addQuotedRxItems)

  const [tab, setTab] = useState<'orders' | 'prescriptions'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingRx, setLoadingRx] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true, state: { from: { pathname: location.pathname } } })
    }
  }, [user, navigate, location])

  useEffect(() => {
    if (!user) return
    setLoadingOrders(true)
    axiosClient.get('/orders/my')
      .then((res: any) => setOrders(res?.data || res || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [user])

  useEffect(() => {
    if (!user) return
    setLoadingRx(true)
    axiosClient.get('/orders/prescriptions/my')
      .then((res: any) => setPrescriptions(res?.data || res || []))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoadingRx(false))
  }, [user])

  if (!user) return null

  const handleAddApprovedToCart = (rx: any) => {
    if (!rx.medicines || rx.medicines.length === 0) return
    const items = rx.medicines.map((m: any) => ({
      id: m.productId?.toString() || m._id,
      name: m.name,
      price: m.price,
      quantity: m.quantity,
    }))
    addQuotedRxItems(items)
    navigate('/cart')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý đơn hàng</h1>
        <p className="text-slate-500 mt-1">Theo dõi đơn hàng và đơn thuốc kê đơn của bạn</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {([
          { key: 'orders', label: 'Đơn hàng', icon: <Package className="w-4 h-4" /> },
          { key: 'prescriptions', label: 'Đơn thuốc Rx', icon: <FileText className="w-4 h-4" /> },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors
              ${tab === t.key ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.icon} {t.label}
            {tab === t.key && (
              <motion.div layoutId="orders-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {loadingOrders ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Bạn chưa có đơn hàng nào</p>
                <Link to="/products" className="inline-block mt-4 text-sky-600 hover:text-sky-700 font-semibold">
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Mã đơn</span>
                        <span className="font-bold text-slate-800 font-mono">{order.orderCode || order._id}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ORDER_STATUS[order.status]?.colorClass || 'bg-slate-100 text-slate-600'}`}>
                          {ORDER_STATUS[order.status]?.label || order.status}
                        </span>
                        {order.isQuoted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            Từ Dược sĩ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {fmtDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="w-4 h-4" />
                          {order.items?.length || 0} sản phẩm
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-0.5">Tổng tiền</p>
                        <p className="font-bold text-sky-600 text-lg">{fmt(order.totalAmount)}</p>
                      </div>
                      <Link
                        to={`/orders/${order.orderCode || order._id}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-sky-50 text-sky-600 font-semibold text-sm hover:bg-sky-100 transition-colors w-full md:w-auto"
                      >
                        Theo dõi <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── PRESCRIPTIONS TAB ── */}
        {tab === 'prescriptions' && (
          <motion.div key="prescriptions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {loadingRx ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Bạn chưa gửi đơn thuốc kê đơn nào</p>
                <Link to="/products" className="inline-block mt-4 text-sky-600 hover:text-sky-700 font-semibold">
                  Tìm thuốc kê đơn (Rx)
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {prescriptions.map((rx: any) => {
                  const statusInfo = RX_STATUS[rx.status] || RX_STATUS.PENDING
                  return (
                    <div key={rx._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <div className="flex items-start gap-4 flex-wrap">
                        {/* Prescription image */}
                        {rx.thumbnailUrl && (
                          <img
                            src={rx.thumbnailUrl}
                            alt="Đơn thuốc"
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-bold text-slate-800 font-mono">
                              {rx.requestCode || rx._id?.slice(-8)}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.colorClass}`}>
                              {statusInfo.icon} {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mb-1">
                            <Clock className="w-3.5 h-3.5 inline mr-1" />
                            {fmtDate(rx.createdAt)}
                          </p>
                          {rx.status === 'APPROVED' && rx.medicines?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-slate-600 mb-2">Báo giá từ dược sĩ:</p>
                              <div className="flex flex-col gap-1 mb-3">
                                {rx.medicines.map((m: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-slate-700">{m.name} × {m.quantity}</span>
                                    <span className="font-semibold text-slate-800">{fmt(m.price * m.quantity)}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm font-bold text-sky-700 border-t border-slate-100 pt-1 mt-1">
                                  <span>Tổng báo giá</span>
                                  <span>{fmt(rx.totalAmount)}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddApprovedToCart(rx)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Thêm vào giỏ & Thanh toán
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
