import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, RefreshCw, Truck, XCircle, Search } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const STATUS_FLOW: Record<string, { label: string; color: string; next?: string; nextLabel?: string }> = {
  UNPAID:     { label: 'Chờ thanh toán', color: 'bg-amber-100 text-amber-700',   next: 'PAID',       nextLabel: '✓ Xác nhận đã nhận tiền' },
  PAID:       { label: 'Đã thanh toán',  color: 'bg-blue-100 text-blue-700',     next: 'PROCESSING', nextLabel: '📦 Bắt đầu đóng gói' },
  PROCESSING: { label: 'Đang đóng gói',  color: 'bg-indigo-100 text-indigo-700', next: 'SHIPPED',    nextLabel: '🚚 Giao cho vận chuyển' },
  SHIPPED:    { label: 'Đang giao',      color: 'bg-sky-100 text-sky-700',       next: 'COMPLETED',  nextLabel: '✅ Hoàn thành' },
  COMPLETED:  { label: 'Hoàn thành',     color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED:  { label: 'Đã hủy',         color: 'bg-red-100 text-red-700' },
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  UNPAID:     <Clock className="w-4 h-4" />,
  PAID:       <CheckCircle2 className="w-4 h-4" />,
  PROCESSING: <Package className="w-4 h-4" />,
  SHIPPED:    <Truck className="w-4 h-4" />,
  COMPLETED:  <CheckCircle2 className="w-4 h-4" />,
  CANCELLED:  <XCircle className="w-4 h-4" />,
};

function fmt(n: number) { 
  if (n === undefined || n === null) return '0đ';
  return n.toLocaleString('vi-VN') + 'đ'; 
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res: any = await axiosClient.get('/orders/all');
      setOrders(res?.data || res || []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await axiosClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCodComplete = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      // COD: mark both PAID + COMPLETED simultaneously
      await axiosClient.put(`/orders/${orderId}/status`, { status: 'COMPLETED' });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'COMPLETED' } : o));
    } catch { }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const search = searchTerm.toLowerCase();
    const matchSearch = !search
      || o.orderCode?.toLowerCase().includes(search)
      || o.customerName?.toLowerCase().includes(search)
      || o.customerPhone?.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Mã đơn, tên, SĐT..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', ...Object.keys(STATUS_FLOW)].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterStatus === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'Tất cả' : STATUS_FLOW[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Không có đơn hàng nào phù hợp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-semibold">Mã đơn</th>
                  <th className="p-4 font-semibold">Khách hàng</th>
                  <th className="p-4 font-semibold">Thời gian</th>
                  <th className="p-4 font-semibold">Tổng tiền</th>
                  <th className="p-4 font-semibold">TT Thanh toán</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const statusInfo = STATUS_FLOW[order.status];
                  const nextStatus = statusInfo?.next;
                  const isCod = order.paymentMethod === 'cod';
                  const isUpdating = updatingId === order._id;

                  return (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-bold text-blue-700">{order.orderCode || order._id?.slice(-8)}</span>
                        {order.isQuoted && (
                          <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Rx</span>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-sm text-gray-800">{order.customerName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{fmtDate(order.createdAt)}</td>
                      <td className="p-4 font-semibold text-gray-800">{fmt(order.totalAmount)}</td>
                      <td className="p-4">
                        <span className="text-xs font-semibold uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'transfer' ? 'Chuyển khoản' : order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_ICON[order.status]}
                          {statusInfo?.label || order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* COD completed flow: ship + collect */}
                          {isCod && order.status === 'SHIPPED' && (
                            <button
                              onClick={() => handleCodComplete(order._id)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              {isUpdating ? '...' : '💰 Thu tiền & Hoàn thành'}
                            </button>
                          )}
                          {/* Normal next-status flow */}
                          {nextStatus && !(isCod && order.status === 'SHIPPED') && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, nextStatus)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : statusInfo.nextLabel}
                            </button>
                          )}
                          {/* Cancel */}
                          {!['COMPLETED', 'CANCELLED'].includes(order.status) && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                              disabled={isUpdating}
                              className="px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                            >
                              Hủy
                            </button>
                          )}
                          {['COMPLETED', 'CANCELLED'].includes(order.status) && (
                            <span className="text-xs text-gray-400 italic">Đã kết thúc</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
