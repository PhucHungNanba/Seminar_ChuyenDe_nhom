import { useState, useEffect } from 'react';
import { Search, Eye, X, Plus, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayId } from '../../utils/formatHelpers';
import axiosClient from '../../api/axiosClient';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

export default function RxApprovalPage() {
  const { 
    rxRequests: requests, selectedRequest, builderItems, 
    selectRequest, addBuilderItem, removeBuilderItem, updateBuilderItemQty, 
    approveRx, rejectRx, clearBuilder, fetchRxRequests, isLoadingRx, rxError 
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [catalog, setCatalog] = useState<any[]>([]);

  useEffect(() => {
    fetchRxRequests();
  }, [fetchRxRequests]);

  useEffect(() => {
    const fetchCatalog = async () => {
      if (catalogSearch.length > 1) {
        try {
          const res: any = await axiosClient.get(`/products?search=${catalogSearch}`);
          setCatalog(res.data || res || []);
        } catch (error) {
          console.error('Error fetching catalog:', error);
        }
      } else {
        setCatalog([]);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchCatalog();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [catalogSearch]);

  const filteredRequests = requests.filter(req => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = req._id?.toLowerCase().includes(searchLower);
    const codeMatch = (req.requestCode || req.prescriptionCode || '')?.toLowerCase().includes(searchLower);
    const phoneMatch = req.customerPhone?.includes(searchTerm);
    return idMatch || codeMatch || phoneMatch;
  });

  const totalAmount = builderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoadingRx) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (rxError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <p>{rxError}</p>
        <button onClick={() => fetchRxRequests()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Xét duyệt Đơn thuốc (Rx)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm theo mã YC, SĐT..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Mã yêu cầu</th>
                <th className="p-4 font-semibold">Thời gian</th>
                <th className="p-4 font-semibold">SĐT Khách</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-blue-600">
                    {req.requestCode || req.prescriptionCode || formatDisplayId(req._id, 'RX')}
                  </td>
                  <td className="p-4 text-gray-600">{new Date(req.createdAt || req.submittedAt).toLocaleString('vi-VN')}</td>
                  <td className="p-4 text-gray-800">{req.customerPhone}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[req.status] || STATUS_COLORS.PENDING}`}>
                      {STATUS_LABELS[req.status] || STATUS_LABELS.PENDING}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { selectRequest(req); setZoomLevel(1); }}
                      className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Không tìm thấy yêu cầu nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Drawer */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={clearBuilder}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl bg-white h-full shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              <div className="w-full md:w-1/2 bg-gray-100 border-r border-gray-200 flex flex-col h-[40vh] md:h-full">
                <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
                  <h3 className="font-semibold text-gray-800">Ảnh đơn thuốc</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.2))} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><ZoomOut className="w-5 h-5"/></button>
                    <button onClick={() => setZoomLevel(1)} className="p-1.5 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-600">Reset</button>
                    <button onClick={() => setZoomLevel(z => Math.min(3, z + 0.2))} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><ZoomIn className="w-5 h-5"/></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-200/50">
                  <motion.img 
                    animate={{ scale: zoomLevel }}
                    transition={{ type: 'tween', duration: 0.2 }}
                    src={selectedRequest.thumbnailUrl || selectedRequest.imageUrl} 
                    alt="Prescription" 
                    className="max-w-full h-auto rounded shadow-sm origin-center"
                    draggable={false}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 bg-white flex flex-col h-[60vh] md:h-full">
                <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">PrescriptionBuilder</h3>
                    <p className="text-sm text-gray-500">Yêu cầu: {selectedRequest.requestCode || selectedRequest.prescriptionCode || formatDisplayId(selectedRequest._id, 'RX')}</p>
                  </div>
                  <button onClick={clearBuilder} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Tìm thuốc trong kho</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Nhập tên thuốc..." 
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    {catalogSearch && (
                      <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden max-h-40 overflow-y-auto">
                        {catalog.map(item => (
                          <div key={item._id} className="flex justify-between items-center p-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                            <div>
                              <div className="text-sm font-medium text-gray-800">{item.name}</div>
                              <div className="text-xs text-blue-600 font-semibold">{item.price?.toLocaleString('vi-VN')}đ</div>
                            </div>
                            <button 
                              onClick={() => addBuilderItem(item)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {catalog.length === 0 && <div className="p-2 text-center text-sm text-gray-500">Không tìm thấy sản phẩm.</div>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Danh sách thuốc xuất bán</label>
                    {builderItems.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                        Chưa có thuốc nào được thêm
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {builderItems.map(item => (
                          <div key={item._id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-800">{item.name}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateBuilderItemQty(item._id, parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                              />
                            </div>
                            <div className="w-24 text-right text-sm font-semibold text-blue-700">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </div>
                            <button 
                              onClick={() => removeBuilderItem(item._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">Tổng tiền báo giá:</span>
                    <span className="text-xl font-bold text-blue-700">{totalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => rejectRx(selectedRequest._id)}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
                    >
                      Từ chối toa thuốc
                    </button>
                    <button 
                      onClick={() => approveRx(selectedRequest._id)}
                      disabled={builderItems.length === 0}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition-colors shadow-sm"
                    >
                      Hoàn tất & Gửi báo giá
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
