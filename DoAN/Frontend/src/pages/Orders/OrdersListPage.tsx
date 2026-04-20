import { Link } from 'react-router-dom'
import { MOCK_ORDERS } from '../OrderTracking/OrderTrackingPage'
import { Package, Clock, ChevronRight } from 'lucide-react'

// Convert MOCK_ORDERS object to an array and sort by createdAt descending
const ordersList = Object.values(MOCK_ORDERS).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const statusMap: Record<string, { label: string, colorClass: string }> = {
  pending: { label: 'Chờ xác nhận', colorClass: 'bg-amber-100 text-amber-700' },
  packing: { label: 'Đang đóng gói', colorClass: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', colorClass: 'bg-sky-100 text-sky-700' },
  done: { label: 'Hoàn thành', colorClass: 'bg-emerald-100 text-emerald-700' },
}

export default function OrdersListPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Đơn hàng của tôi</h1>
        <p className="text-slate-500 mt-1">Theo dõi và quản lý lịch sử đặt hàng</p>
      </div>

      <div className="flex flex-col gap-4">
        {ordersList.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-slate-800">{order.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusMap[order.status]?.colorClass || 'bg-slate-100 text-slate-600'}`}>
                  {statusMap[order.status]?.label || order.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {fmtDate(order.createdAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  {order.items.length} sản phẩm
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.items.slice(0, 3).map((item, idx) => (
                  <img key={idx} src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100" title={item.name} />
                ))}
                {order.items.length > 3 && (
                  <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center text-xs font-medium text-slate-500">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Tổng tiền</p>
                <p className="font-bold text-sky-600 text-lg">{fmt(order.total)}</p>
              </div>
              
              <Link to={`/orders/${order.id}`} className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-sky-50 text-sky-600 font-semibold text-sm hover:bg-sky-100 transition-colors w-full md:w-auto">
                Theo dõi
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
        
        {ordersList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Bạn chưa có đơn hàng nào</p>
            <Link to="/products" className="inline-block mt-4 text-sky-600 hover:text-sky-700 font-semibold">
              Khám phá sản phẩm
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
