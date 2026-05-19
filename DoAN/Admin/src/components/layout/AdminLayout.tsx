import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSignature, 
  PackageSearch, 
  Search, 
  Bell, 
  Menu,
  X,
  ShoppingCart,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  UserCheck,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../api/axiosClient';

const NAV_ITEMS = [
  { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { path: '/admin/rx-approval', label: 'Xét duyệt Đơn thuốc (Rx)', icon: FileSignature },
  { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart },
  { path: '/admin/inventory', label: 'Sản phẩm & Tồn kho', icon: PackageSearch },
  { path: '/admin/users', label: 'Quản lý Người dùng', icon: Users },
];

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Parse admin user data if available
  const storedUser = localStorage.getItem('adminUser');
  const adminUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
    };
    window.addEventListener('admin-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('admin-unauthorized', handleUnauthorized);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    setIsLoggingIn(true);
    setErrorMsg('');
    try {
      const res: any = await axiosClient.post('/users/login', { email, password });
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (!token) {
        throw new Error('Không nhận được token từ máy chủ.');
      }

      if (user && (user.role === 'Admin' || user.role === 'Pharmacist')) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setIsAuthenticated(true);
        setErrorMsg('');
        // Force reload window to clean and bootstrap state/contexts
        window.location.reload();
      } else {
        setErrorMsg('Tài khoản không có quyền truy cập trang quản trị!');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Đăng nhập thất bại.';
      setErrorMsg(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'pharmacist') => {
    if (role === 'admin') {
      setEmail('admin@medicine.com');
      setPassword('Password123!');
    } else {
      setEmail('pharmacist@medicine.com');
      setPassword('Password123!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    window.location.reload();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-blue-900 text-white">
      <div className="flex items-center justify-between h-16 px-6 border-b border-blue-800">
        <div className="font-bold text-xl tracking-wider text-white">PharmaAdmin</div>
        {adminUser && (
          <span className="text-xs px-2 py-0.5 bg-blue-800 text-blue-200 rounded font-medium border border-blue-700">
            {adminUser.role === 'Admin' ? 'Admin' : 'Dược sĩ'}
          </span>
        )}
      </div>

      {adminUser && (
        <div className="px-6 py-4 bg-blue-950/40 border-b border-blue-800/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-600/50 flex items-center justify-center font-bold text-white border border-blue-500">
            {adminUser.fullName?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{adminUser.fullName}</h4>
            <p className="text-xs text-blue-300 truncate">{adminUser.email}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 py-4 overflow-y-auto">
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
                      ? 'bg-blue-800 border-l-4 border-red-500 text-white' 
                      : 'hover:bg-blue-800/50 border-l-4 border-transparent text-blue-100'
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

      <div className="p-4 border-t border-blue-800 flex flex-col gap-2">
        <button 
          onClick={handleLogout}
          className="w-full py-2 bg-red-600/20 hover:bg-red-600 hover:text-white text-red-300 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-red-500/30"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
        <div className="text-center text-xs text-blue-300 mt-1">PharmaCare v1.0.0</div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative background grid and gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 z-0"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md z-10">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Trang Quản Trị Hệ Thống</h2>
              <p className="text-sm text-slate-400">Vui lòng đăng nhập tài khoản Admin hoặc Dược sĩ</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email truy cập</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder="example@medicine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mật khẩu</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-200 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-400 font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-900/20"
              >
                {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập trang quản trị'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">Chọn tài khoản nhanh</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('pharmacist')}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-950 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-xs text-slate-300 transition-colors font-medium"
              >
                <UserCheck className="w-4 h-4 text-emerald-500" />
                Dược sĩ chuyên môn
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-950 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-xs text-slate-300 transition-colors font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Quản trị viên
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
