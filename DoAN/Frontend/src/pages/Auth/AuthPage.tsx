import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, Eye, EyeOff, User, ShieldCheck,
  AlertCircle, Loader2, CheckCircle2, Heart, Pill, Activity
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

// ── Background floating icons decoration ────────────────
function FloatingIcon({ icon: Icon, style }: { icon: any; style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute opacity-10 text-sky-600"
      animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
      style={style}
    >
      <Icon size={32} />
    </motion.div>
  )
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()
  const { login, register, isLoading, error, clearError } = useAuthStore()

  // Redirect dest sau khi login (default: /)
  const from = (location.state as any)?.from?.pathname || '/'

  // Reset error khi đổi tab
  useEffect(() => { clearError() }, [isLogin])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      setLoginSuccess(true)
      setTimeout(() => navigate(from, { replace: true }), 900)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await register(name, email, password)
    if (success) {
      // Nếu auto-login thành công (backend trả token), redirect luôn
      const { user } = useAuthStore.getState()
      if (user) {
        navigate(from, { replace: true })
        return
      }
      // Không có token → hiện thông báo + chuyển sang tab đăng nhập
      setRegisterSuccess(true)
      setTimeout(() => {
        setIsLogin(true)
        setRegisterSuccess(false)
        setName('')
        // Giữ lại email và password để user khỏi nhập lại
      }, 1800)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">

      {/* ── Animated background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50 pointer-events-none" />
      <FloatingIcon icon={Heart}    style={{ top: '8%',  left: '5%' }} />
      <FloatingIcon icon={Pill}     style={{ top: '15%', right: '8%' }} />
      <FloatingIcon icon={Activity} style={{ bottom: '20%', left: '10%' }} />
      <FloatingIcon icon={ShieldCheck} style={{ bottom: '10%', right: '5%' }} />

      <div className="relative z-10 max-w-md w-full">

        {/* ── Logo / Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            className="flex justify-center mb-4"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">PharmaCare</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Đồng hành cùng sức khỏe của bạn</p>
        </motion.div>

        {/* ── Auth Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-100 relative">
            <div className="flex-1">
              <button
                id="tab-login"
                onClick={() => setIsLogin(true)}
                className={`w-full py-4 text-sm font-semibold transition-colors ${
                  isLogin ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Đăng nhập
              </button>
            </div>
            <div className="flex-1">
              <button
                id="tab-register"
                onClick={() => setIsLogin(false)}
                className={`w-full py-4 text-sm font-semibold transition-colors ${
                  !isLogin ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Animated Tab Indicator */}
            <div className="absolute bottom-0 left-0 w-full flex h-[2px]">
              <motion.div
                className={`h-full w-1/2 rounded-full ${isLogin ? 'bg-sky-500' : 'bg-emerald-500'}`}
                initial={false}
                animate={{ x: isLogin ? '0%' : '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">

              {/* ══ FORM ĐĂNG NHẬP ══ */}
              {isLogin && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="flex flex-col gap-4"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="customer@gmail.com"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                                   transition-all text-sm bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                      <a href="#" className="text-xs font-medium text-sky-500 hover:text-sky-700 transition-colors">
                        Quên mật khẩu?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                                   transition-all text-sm bg-slate-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        id="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.button
                    id="btn-login-submit"
                    type="submit"
                    disabled={isLoading || loginSuccess}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl
                                font-bold text-sm text-white shadow-md transition-all duration-200 mt-1
                                ${loginSuccess
                                  ? 'bg-emerald-500 shadow-emerald-200'
                                  : isLoading
                                    ? 'bg-sky-400 cursor-wait shadow-sky-100'
                                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-200 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2'
                                }
                                disabled:opacity-90`}
                  >
                    <AnimatePresence mode="wait">
                      {loginSuccess ? (
                        <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Đăng nhập thành công!
                        </motion.span>
                      ) : isLoading ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          Đăng nhập
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Demo hint */}
                  <p className="text-center text-xs text-slate-400 mt-1">
                    Tài khoản demo:{' '}
                    <button
                      type="button"
                      onClick={() => { setEmail('customer@gmail.com'); setPassword('Password123!') }}
                      className="text-sky-500 hover:text-sky-700 font-medium underline underline-offset-2 transition-colors"
                    >
                      customer@gmail.com / Password123!
                    </button>
                  </p>
                </motion.form>
              )}

              {/* ══ FORM ĐĂNG KÝ ══ */}
              {!isLogin && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="flex flex-col gap-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input
                        id="register-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                                   transition-all text-sm bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input
                        id="register-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                                   transition-all text-sm bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tối thiểu 8 ký tự"
                        className="block w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                                   transition-all text-sm bg-slate-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>


                  {/* Error banner (shared state) */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success banner */}
                  <AnimatePresence>
                    {registerSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-medium">Đăng ký thành công! Đang chuyển sang trang đăng nhập...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    id="btn-register-submit"
                    type="submit"
                    disabled={isLoading || registerSuccess}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl
                               font-bold text-sm text-white shadow-md transition-all mt-1
                               ${registerSuccess
                                 ? 'bg-emerald-500 shadow-emerald-200'
                                 : isLoading
                                   ? 'bg-emerald-400 cursor-wait shadow-emerald-100'
                                   : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-100 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2'
                               }
                               disabled:opacity-90`}
                  >
                    <AnimatePresence mode="wait">
                      {registerSuccess ? (
                        <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Đăng ký thành công!
                        </motion.span>
                      ) : isLoading ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Đang tạo tài khoản...
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          Tạo tài khoản
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>

              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Footer trust badge ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          Thông tin của bạn được bảo mật theo tiêu chuẩn SSL/TLS
        </motion.p>
      </div>
    </div>
  )
}
