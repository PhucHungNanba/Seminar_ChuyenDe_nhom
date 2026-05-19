import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import RxApprovalPage from './pages/RxApproval/RxApprovalPage';
import InventoryManagementPage from './pages/Inventory/InventoryManagementPage';
import OrdersManagementPage from './pages/Orders/OrdersManagementPage';
import UserManagementPage from './pages/Users/UserManagementPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="rx-approval" element={<RxApprovalPage />} />
          <Route path="orders" element={<OrdersManagementPage />} />
          <Route path="inventory" element={<InventoryManagementPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

