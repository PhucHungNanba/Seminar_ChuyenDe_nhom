import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSignature, 
  PackageSearch, 
  LineChart, 
  Search, 
  Bell, 
  Menu,
  X,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { path: '/admin/rx-approval', label: 'Xét duyệt Đơn thuốc (Rx)', icon: FileSignature },
  { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart },
  { path: '/admin/inventory', label: 'Sản phẩm & Tồn kho', icon: PackageSearch },
  { path: '/admin/analytics', label: 'Báo cáo Phân tích', icon: LineChart },
];

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-blue-900 text-white">
      <div className="flex items-center h-16 px-6 font-bold text-xl border-b border-blue-800">
        PharmaAdmin
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-6 py-3 transition-colors ${
                    isActive 
                      ? 'bg-blue-800 border-l-4 border-red-600' 
                      : 'hover:bg-blue-800/50 border-l-4 border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-800 text-sm text-blue-300">
        PharmaCare v1.0.0
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 z-20 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-blue-900 z-50 lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-red-400"
              >
                <X className="w-6 h-6" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm z-10 flex flex-shrink-0 items-center justify-between px-4 lg:px-8 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-4 lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none w-64 lg:w-96 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold overflow-hidden cursor-pointer">
              <img src="https://i.pravatar.cc/150?img=11" alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
