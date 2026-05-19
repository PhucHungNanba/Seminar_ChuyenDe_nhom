import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Filter, 
  User, 
  Award,
  ShieldAlert, 
  UserCheck, 
  AlertCircle,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../api/axiosClient';

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Pharmacist' | 'Customer';
  phone?: string;
  reward_points?: number;
  createdAt?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Modals state
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);
  
  // Form input state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'Admin' | 'Pharmacist' | 'Customer'>('Customer');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notifications state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (selectedRole) {
        params.append('role', selectedRole);
      }

      const res: any = await axiosClient.get(`/users?${params.toString()}`);
      if (res?.success) {
        setUsers(res.users || []);
      } else {
        setUsers(res || []);
      }
    } catch (err: any) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách người dùng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, selectedRole]);

  // Toast auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Open Edit modal
  const handleOpenEdit = (user: UserData) => {
    setEditingUser(user);
    setFormName(user.fullName);
    setFormPhone(user.phone || '');
    setFormRole(user.role);
    setSubmitError(null);
  };

  // Submit Edit API
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setSubmitError('Họ tên không được để trống.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res: any = await axiosClient.put(`/users/${editingUser?._id}`, {
        fullName: formName,
        phone: formPhone,
        role: formRole
      });

      if (res?.success) {
        setNotification({ type: 'success', message: 'Cập nhật thông tin người dùng thành công!' });
        setEditingUser(null);
        fetchUsers();
      } else {
        throw new Error(res?.message || 'Cập nhật thất bại');
      }
    } catch (err: any) {
      console.error('Lỗi cập nhật người dùng:', err);
      setSubmitError(err.response?.data?.message || 'Không thể cập nhật thông tin người dùng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete API
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    setIsSubmitting(true);
    try {
      const res: any = await axiosClient.delete(`/users/${deletingUser._id}`);
      if (res?.success) {
        setNotification({ type: 'success', message: 'Xóa tài khoản người dùng thành công!' });
        setDeletingUser(null);
        fetchUsers();
      } else {
        throw new Error(res?.message || 'Xóa thất bại');
      }
    } catch (err: any) {
      console.error('Lỗi khi xóa người dùng:', err);
      setNotification({ 
        type: 'error', 
        message: err.response?.data?.message || 'Đã xảy ra lỗi trong quá trình xóa tài khoản.' 
      });
      setDeletingUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role: 'Admin' | 'Pharmacist' | 'Customer') => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin
          </span>
        );
      case 'Pharmacist':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5" />
            Pharmacist
          </span>
        );
      case 'Customer':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <User className="w-3.5 h-3.5" />
            Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 relative min-h-full pb-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              notification.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 ml-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quản lý Người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tra cứu, cập nhật thông tin và phân quyền hệ thống cho toàn bộ tài khoản người dùng.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm theo Email hoặc Số điện thoại..." 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none rounded-xl text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Vai trò:</span>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none rounded-xl text-sm transition-all focus:ring-4 focus:ring-blue-100 cursor-pointer"
          >
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Pharmacist">Dược sĩ (Pharmacist)</option>
            <option value="Customer">Khách hàng (Customer)</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500 font-medium">Đang tải danh sách tài khoản...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="text-base font-semibold text-gray-900">Không thể tải dữ liệu</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Không tìm thấy người dùng nào</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò hiện tại.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Họ tên & Email</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Điểm thưởng</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4 pr-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50/65 flex items-center justify-center text-blue-700 font-bold shrink-0 border border-blue-100/60 uppercase">
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-800 truncate">{user.fullName}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa cập nhật</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-800">
                          {user.reward_points?.toLocaleString('vi-VN') || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-150"
                          title="Chỉnh sửa vai trò & thông tin"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => setDeletingUser(user)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-150"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-55">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Chỉnh sửa thông tin</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">Email: {editingUser.email}</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)}
                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdateUser}>
                <div className="p-6 space-y-4">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex gap-2 items-center">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Họ tên */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Họ và Tên</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none rounded-xl text-sm transition-all focus:ring-4 focus:ring-blue-100"
                      placeholder="Nguyễn Văn A"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Số điện thoại</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 outline-none rounded-xl text-sm transition-all focus:ring-4 focus:ring-blue-100"
                      placeholder="09xxxxxxxx"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>

                  {/* Vai trò */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Vai trò (Role)</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none rounded-xl text-sm transition-all focus:ring-4 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="Customer">Customer (Khách hàng)</option>
                      <option value="Pharmacist">Pharmacist (Dược sĩ)</option>
                      <option value="Admin">Admin (Quản trị viên)</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingUser(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 p-6 text-center"
            >
              <div className="mx-auto h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg">Xác nhận xóa tài khoản</h3>
              <p className="text-sm text-gray-500 mt-2">
                Bạn có chắc chắn muốn xóa tài khoản của <strong className="text-gray-700 font-semibold">{deletingUser.fullName}</strong>?
              </p>
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5 mt-3 font-medium">
                Hành động này không thể hoàn tác. Người dùng sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.
              </p>

              <div className="flex gap-3 justify-center mt-6">
                <button 
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                  {isSubmitting ? 'Đang xóa...' : 'Đồng ý xóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
