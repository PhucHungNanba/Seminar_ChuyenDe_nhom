import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DollarSign, FileSignature, Package, CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'T2', value: 12000000 },
  { name: 'T3', value: 19000000 },
  { name: 'T4', value: 15000000 },
  { name: 'T5', value: 22000000 },
  { name: 'T6', value: 28000000 },
  { name: 'T7', value: 35000000 },
  { name: 'CN', value: 31000000 },
];

const MARKET_BASKET_RULES = [
  { id: 1, if: 'Amoxicillin 500mg', then: 'Men vi sinh Bioflora', confidence: 85, lift: 3.2 },
  { id: 2, if: 'Máy đo đường huyết', then: 'Que thử đường huyết', confidence: 95, lift: 4.5 },
  { id: 3, if: 'Panadol Extra', then: 'Vitamin C sủi', confidence: 65, lift: 2.1 },
  { id: 4, if: 'Khẩu trang y tế', then: 'Nước rửa tay khô', confidence: 72, lift: 2.8 },
];

export default function AnalyticsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo Phân tích</h1>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>Tháng này</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Doanh thu ngày', value: '31.000.000đ', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+15%' },
          { title: 'Đơn chờ duyệt Rx', value: '12', icon: FileSignature, color: 'text-yellow-600', bg: 'bg-yellow-100', trend: '-2' },
          { title: 'Lượt giao bằng Drone', value: '45', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+8%' },
          { title: 'Đơn thành công', value: '156', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', trend: '+24%' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {kpi.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{kpi.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Doanh thu */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Xu hướng Doanh thu (7 ngày qua)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Khai phá Dữ liệu */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Insight Khai phá Dữ liệu</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Các luật kết hợp phổ biến (Market Basket Analysis) được khai phá từ dữ liệu giao dịch.</p>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {MARKET_BASKET_RULES.map((rule) => (
              <div key={rule.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all group bg-gray-50 hover:bg-white">
                <div className="text-sm text-gray-800 mb-3 leading-relaxed">
                  Khi khách mua <span className="font-semibold text-indigo-700">[{rule.if}]</span>, <span className="font-bold text-green-600">{rule.confidence}%</span> khả năng sẽ mua thêm <span className="font-semibold text-indigo-700">[{rule.then}]</span>.
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">Lift: {rule.lift}</span>
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition-colors opacity-0 group-hover:opacity-100">
                    Áp dụng luật này lên trang Storefront
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
