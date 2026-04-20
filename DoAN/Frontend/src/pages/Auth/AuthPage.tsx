import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Giả lập xử lý thành công, chuyển hướng đến trang cá nhân
    navigate('/profile')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            PharmaCare
          </h2>
          <p className="text-slate-500 mt-2">
            Đồng hành cùng sức khỏe của bạn
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 relative">
            <div className="flex-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-full py-4 text-sm font-semibold transition-colors ${
                  isLogin ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Đăng nhập
              </button>
            </div>
            <div className="flex-1">
              <button
                onClick={() => setIsLogin(false)}
                className={`w-full py-4 text-sm font-semibold transition-colors ${
                  !isLogin ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Đăng ký
              </button>
            </div>
            
            {/* Animated Tab Indicator */}
            <div className="absolute bottom-0 left-0 w-full flex h-[2px]">
              <motion.div 
                className={`h-full w-1/2 ${isLogin ? 'bg-sky-500' : 'bg-emerald-500'}`}
                initial={false}
                animate={{ x: isLogin ? '0%' : '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        isLogin ? 'focus:ring-sky-500' : 'focus:ring-emerald-500'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                    {isLogin && (
                      <a href="#" className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                        Quên mật khẩu?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        isLogin ? 'focus:ring-sky-500' : 'focus:ring-emerald-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all mt-2 ${
                    isLogin 
                      ? 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-500' 
                      : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
