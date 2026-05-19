import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Clock, ShieldCheck,
  Receipt, ChevronRight, FileText, CheckCircle2, AlertCircle
} from 'lucide-react'
import StepperProgress, { StepKey } from '../../components/order/StepperProgress'
import TypeBadge from '../../components/common/TypeBadge'
import { useAuthStore } from '../../store/authStore'
import axiosClient from '../../api/axiosClient'

function fmt(n: number) {
  if (n === undefined || n === null) return '0đ'
  return n.toLocaleString('vi-VN') + 'đ'
}

function fmtTime(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Chờ thanh toán',
  PENDING: 'Chờ duyệt',
  PROCESSING: 'Đang đóng gói',
  SHIPPED: 'Đang giao hàng',
  COMPLETED: 'Đã nhận hàng',
  CANCELLED: 'Đã hủy',
}

function mapStatusToStepKey(status: string): StepKey {
  const s = (status || '').toUpperCase()
  if (s === 'UNPAID' || s === 'PENDING') return 'pending'
  if (s === 'PROCESSING') return 'packing'
  if (s === 'SHIPPED') return 'shipping'
  if (s === 'COMPLETED') return 'done'
  return 'pending' // fallback
}

export default function OrderTrackingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true, state: { from: { pathname: location.pathname } } })
    }
  }, [user, navigate, location])

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const response = await axiosClient.get(`/orders/${id}`)
        const data = response.data?.data || response.data
        if (!data) {
          setError('Không tìm thấy đơn hàng')
        } else {
          setOrder(data)
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err)
        if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng')
        } else {
          setError(err.response?.data?.message || err.message || 'Lỗi khi tải thông tin đơn hàng')
        }
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOrder()
    }
  }, [id, user])

  if (!user) return null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
        <p className="text-sm text-slate-400 font-medium">Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="p-5 rounded-full bg-rose-50">
          <AlertCircle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">{error || 'Không tìm thấy đơn hàng'}</h2>
        <p className="text-slate-400 text-sm max-w-md">
          Có vẻ mã đơn hàng không tồn tại hoặc bạn không có quyền truy cập đơn hàng này.
        </p>
        <Link
          to="/orders"
          className="mt-2 px-6 py-2.5 rounded-full bg-sky-500 text-white font-medium
                     hover:bg-sky-600 transition-colors text-sm shadow-md"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    )
  }

  const orderCode = order.orderCode || order._id
  const totalAmount = order.totalAmount ?? order.total ?? 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="p-2 rounded-full hover:bg-sky-50 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Theo dõi đơn hàng</h1>
          <p className="text-sm text-slate-400 font-mono">{orderCode}</p>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
              order.status === 'SHIPPED' ? 'bg-sky-100 text-sky-700' :
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'}`}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ══ LEFT: Tracking card (2/3 width) ════════ */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Stepper card */}
          <motion.section
            layout
            className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-slate-900 text-lg">Trạng thái đơn hàng</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Đặt lúc {fmtTime(order.createdAt)}</span>
              </div>
            </div>

            <StepperProgress currentStep={mapStatusToStepKey(order.status)} />
          </motion.section>
        </div>

        {/* ══ RIGHT: Order detail sidebar ════════════ */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Order items */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-500" />
              Sản phẩm đã đặt
            </h2>

            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
              {order.items?.map((item: any) => {
                const itemImg = item.imageUrl || (item.type === 'rx' 
                  ? 'https://placehold.co/56x56/fef3c7/f59e0b?text=Rx' 
                  : 'https://placehold.co/56x56/e0f2fe/0ea5e9?text=OTC')
                return (
                  <div key={item.productId || item.id || item._id} className="flex gap-3">
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 leading-tight truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {item.type && <TypeBadge type={item.type} size="sm" />}
                        <span className="text-xs text-slate-400">×{item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-800 shrink-0">
                      {fmt(item.price * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>

            {order.prescriptionImageUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Đơn thuốc đã gửi:</p>
                <div className="flex items-center gap-2">
                  <img src={order.prescriptionImageUrl} alt="Đơn thuốc"
                    className="w-12 h-8 rounded object-cover border border-emerald-200" />
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đơn thuốc được liên kết
                  </div>
                </div>
              </div>
            )}

            <div className="h-px bg-slate-100 my-4" />
            <div className="flex justify-between font-bold text-slate-900 text-base">
              <span>Tổng cộng</span>
              <span className="text-sky-600">{fmt(totalAmount)}</span>
            </div>
          </section>

          {/* Confirmation info */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Xác nhận & Bảo mật
            </h2>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-500">
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

          {/* View full order history */}
          <Link to="/orders"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                       border border-slate-200 text-slate-600 text-sm font-semibold
                       hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm">
            <FileText className="w-4 h-4" />
            Lịch sử đơn hàng
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
