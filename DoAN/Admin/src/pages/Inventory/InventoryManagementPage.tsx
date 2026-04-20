import { useState } from 'react';
import { Search, Edit2, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const INVENTORY_DATA = [
  { id: 'MED-001', name: 'Paracetamol 500mg', total: 1500, q1: 500, q5: 1000 },
  { id: 'MED-002', name: 'Amoxicillin 250mg', total: 45, q1: 40, q5: 5 },
  { id: 'MED-003', name: 'Vitamin C 1000mg', total: 8, q1: 0, q5: 8 },
  { id: 'MED-004', name: 'Lisinopril 10mg', total: 120, q1: 60, q5: 60 },
  { id: 'MED-005', name: 'Metformin 850mg', total: 300, q1: 150, q5: 150 },
];

type Branch = 'q1' | 'q5';

export default function InventoryManagementPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'branches'>('branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(INVENTORY_DATA);
  const [editingCell, setEditingCell] = useState<{ id: string, branch: Branch } | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredData = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (id: string, branch: Branch, currentValue: number) => {
    setEditingCell({ id, branch });
    setEditValue(currentValue.toString());
  };

  const saveEdit = () => {
    if (editingCell) {
      const newValue = parseInt(editValue) || 0;
      setInventory(prev => prev.map(item => {
        if (item.id === editingCell.id) {
          const updatedItem = { ...item, [editingCell.branch]: newValue };
          updatedItem.total = updatedItem.q1 + updatedItem.q5;
          return updatedItem;
        }
        return item;
      }));
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditingCell(null);
  };

  const StockCell = ({ item, branch }: { item: typeof INVENTORY_DATA[0], branch: Branch }) => {
    const isEditing = editingCell?.id === item.id && editingCell?.branch === branch;
    const value = item[branch];
    const isWarning = value < 10;

    if (isEditing) {
      return (
        <input 
          autoFocus
          type="number" 
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-20 px-2 py-1 text-center border-2 border-blue-500 rounded outline-none"
        />
      );
    }

    return (
      <div className="group relative flex items-center justify-center w-full cursor-pointer h-full py-4" onClick={() => startEdit(item.id, branch, value)}>
        <span className={`font-medium ${isWarning ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
          {value}
        </span>
        <button className="absolute right-4 opacity-0 group-hover:opacity-100 p-1 text-blue-600 bg-blue-50 rounded transition-opacity">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm & Tồn kho</h1>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            <Filter className="w-4 h-4 mr-2" /> Bộ lọc
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Xuất Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-4">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-4 font-medium text-sm transition-colors relative ${activeTab === 'all' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tất cả Sản phẩm
            {activeTab === 'all' && (
              <motion.div layoutId="inv-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('branches')}
            className={`px-6 py-4 font-medium text-sm transition-colors relative ${activeTab === 'branches' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tồn kho theo Chi nhánh
            {activeTab === 'branches' && (
              <motion.div layoutId="inv-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />
            )}
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm tên thuốc, mã thuốc..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {activeTab === 'branches' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="p-4 font-semibold">Mã Thuốc</th>
                  <th className="p-4 font-semibold">Tên Thuốc</th>
                  <th className="p-4 font-semibold text-center bg-blue-50/50">Tổng Tồn Kho</th>
                  <th className="p-4 font-semibold text-center border-l border-gray-200">CH Quận 1</th>
                  <th className="p-4 font-semibold text-center border-l border-gray-200">CH Quận 5</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-500 text-sm">{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                    <td className="p-4 text-center bg-blue-50/20 font-semibold text-blue-800">
                      {item.total}
                    </td>
                    <td className="p-0 text-center border-l border-gray-100 align-middle">
                      <StockCell item={item} branch="q1" />
                    </td>
                    <td className="p-0 text-center border-l border-gray-100 align-middle">
                      <StockCell item={item} branch="q5" />
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-4 bg-red-50 text-red-600 text-xs italic flex items-center justify-center border-t border-red-100">
              * Click trực tiếp vào số lượng để chỉnh sửa. Số lượng dưới 10 sẽ hiển thị màu đỏ để cảnh báo.
            </div>
          </div>
        )}

        {activeTab === 'all' && (
           <div className="p-12 text-center text-gray-500">
             Chế độ xem "Tất cả sản phẩm" đang được cập nhật. Vui lòng chuyển sang tab "Tồn kho theo Chi nhánh".
           </div>
        )}
      </div>
    </div>
  );
}
