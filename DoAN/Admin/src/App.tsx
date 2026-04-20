import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import RxApprovalPage from './pages/RxApproval/RxApprovalPage';
import InventoryManagementPage from './pages/Inventory/InventoryManagementPage';
import AnalyticsDashboardPage from './pages/Analytics/AnalyticsDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="rx-approval" element={<RxApprovalPage />} />
          <Route path="inventory" element={<InventoryManagementPage />} />
          <Route path="analytics" element={<AnalyticsDashboardPage />} />
          
          {/* Placeholder cho trang Quản lý Đơn hàng */}
          <Route path="orders" element={<div className="p-8 text-center text-gray-500">Trang quản lý đơn hàng đang phát triển</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
