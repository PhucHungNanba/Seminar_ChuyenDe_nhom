import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  FileSignature, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface DashboardStats {
  totalRevenue: number;
  pendingRx: number;
  lowStockProducts: number;
  completedOrders: number;
  revenueChart: { date: string; revenue: number; amount?: number }[];
  ordersByStatus: {
    PENDING: number;
    PROCESSING: number;
    SHIPPED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await axiosClient.get('/orders/dashboard/stats');
      if (res?.success) {
        setStats(res.data);
      } else if (res?.data) {
        setStats(res.data);
      } else {
        setStats(res);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải số liệu thống kê:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu thống kê từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fmtCurrency = (n: number) => {
    if (n === undefined || n === null) return '0đ';
    return n.toLocaleString('vi-VN') + 'đ';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 font-medium">Đang tải số liệu tổng quan hệ thống...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
        <h3 className="text-base font-semibold text-gray-900">Không thể tải dữ liệu tổng quan</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md">{error || 'Có lỗi xảy ra'}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho biểu đồ tròn (Pie Chart)
  const pieData = [
    { name: 'Chờ xử lý', value: stats.ordersByStatus?.PENDING || 0, color: '#f59e0b' },
    { name: 'Đang đóng gói', value: stats.ordersByStatus?.PROCESSING || 0, color: '#6366f1' },
    { name: 'Đang giao', value: stats.ordersByStatus?.SHIPPED || 0, color: '#0ea5e9' },
    { name: 'Hoàn thành', value: stats.ordersByStatus?.COMPLETED || 0, color: '#10b981' },
    { name: 'Đã hủy', value: stats.ordersByStatus?.CANCELLED || 0, color: '#f43f5e' },
  ].filter(item => item.value > 0);

  const totalOrders = Object.values(stats.ordersByStatus || {}).reduce((sum, v) => sum + v, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tổng quan Hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng quay trở lại. Đây là cập nhật số liệu hoạt động kinh doanh thời gian thực.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
          Làm mới dữ liệu
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tổng doanh thu hoàn thành</h3>
            <p className="text-2xl font-black text-gray-900 leading-tight">
              {fmtCurrency(stats.totalRevenue)}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Đơn chờ duyệt Rx */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Yêu cầu duyệt Rx chờ</h3>
            <p className="text-3xl font-black text-gray-900 leading-tight">
              {stats.pendingRx}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <FileSignature className="w-6 h-6" />
          </div>
        </div>

        {/* Sản phẩm sắp hết hàng */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Sản phẩm sắp hết hàng</h3>
            <p className="text-3xl font-black text-red-600 leading-tight">
              {stats.lowStockProducts}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Đơn thành công */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Đơn hoàn thành</h3>
            <p className="text-3xl font-black text-emerald-600 leading-tight">
              {stats.completedOrders}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Doanh thu (chiếm 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Xu hướng Doanh thu (7 ngày qua)</h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">Chỉ tính đơn Hoàn thành</span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Tròn Trạng thái Đơn hàng (chiếm 1/3) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Tỷ lệ Đơn hàng</h3>
              <p className="text-xs text-gray-400 mt-0.5">Tổng số đơn trong hệ thống: {totalOrders}</p>
            </div>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center relative">
            {pieData.length === 0 ? (
              <p className="text-sm text-gray-400">Không có dữ liệu đơn hàng</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} đơn`, 'Số lượng']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Center Text inside Donut Chart */}
            {pieData.length > 0 && (
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-800">{totalOrders}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tổng đơn</span>
              </div>
            )}
          </div>

          {/* Custom Legends list */}
          <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto max-h-[120px] pr-1">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value} ({((item.value / totalOrders) * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
