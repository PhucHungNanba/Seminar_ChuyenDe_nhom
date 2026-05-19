import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, User, Pill,
  Menu, X, ChevronDown, Bell, MapPin, LogOut
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

// --- Search suggestions mock ---
const SUGGESTIONS = [
  'Paracetamol 500mg',
  'Vitamin C 1000mg',
  'Amoxicillin 500mg (Rx)',
  'Omeprazole 20mg',
  'Cetirizine 10mg',
]

export default function Navbar() {
  const navigate = useNavigate()
  const totalCount = useCartStore((s) => s.totalCount)
  const { user, logout } = useAuthStore()

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input
  const filtered = SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
    }
  }

  function selectSuggestion(s: string) {
    setQuery(s)
    setShowSuggestions(false)
    navigate(`/products?q=${encodeURIComponent(s)}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-800 border-b border-blue-900 shadow-sm">
      {/* ── Main nav ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group lg:mr-2">
            <div className="p-1.5 rounded-lg bg-white transition-transform group-hover:scale-105">
              <Pill className="w-5 h-5 text-blue-800" />
            </div>
            <span className="font-bold text-xl text-white hidden sm:block tracking-tight">
              PharmaCare
            </span>
          </Link>

          {/* Delivery Location - Vibe 2 */}
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white shrink-0 mr-2">
            <MapPin className="w-4 h-4 text-blue-200" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-blue-200 leading-none">Giao đến:</span>
              <span className="text-sm font-semibold leading-tight truncate max-w-[150px]">Phường 5, Quận 5</span>
            </div>
          </button>

          {/* ── Search bar ── */}
          <div ref={searchRef} className="relative flex-1 max-w-xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white border border-transparent rounded-md px-4 py-2 gap-2
                              focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100
                              transition-all duration-200">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  id="navbar-search"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Tìm thuốc, thực phẩm chức năng..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')}>
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && query.length > 0 && filtered.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg
                             border border-slate-100 overflow-hidden z-50"
                >
                  {filtered.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => selectSuggestion(s)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700
                                   hover:bg-slate-50 hover:text-black text-left transition-colors"
                      >
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        {s}
                        {/* Mark Rx items in suggestion */}
                        {s.includes('(Rx)') && (
                          <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-50
                                           px-2 py-0.5 rounded-full border border-amber-200">
                            Rx
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-white">

            {/* Notification — hidden on mobile */}
            <button
              id="btn-notifications"
              className="hidden md:flex p-2 rounded-full hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-800" />
            </button>

            {/* User */}
            <div className="relative group">
              <Link
                to={user ? "/profile" : "/auth"}
                id="btn-user"
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:block text-sm font-medium">
                  {user ? user.fullName || 'Tài khoản' : 'Đăng nhập'}
                </span>
                <ChevronDown className="hidden lg:block w-3.5 h-3.5" />
              </Link>

              {/* Dropdown for logged in user */}
              {user && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Hồ sơ cá nhân</Link>
                    <Link to="/orders" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Đơn hàng của tôi</Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              id="btn-cart"
              className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-full
                         bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm ml-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">Giỏ hàng</span>

              {/* Cart count badge */}
              {totalCount() > 0 && (
                <motion.span
                  key={totalCount()}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center
                             justify-center text-xs font-bold bg-white text-red-600
                             rounded-full px-1 shadow-sm border border-red-600"
                >
                  {totalCount() > 99 ? '99+' : totalCount()}
                </motion.span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Category nav (desktop) ── */}
        <div className="hidden md:flex items-center gap-6 pb-2 pt-1 text-sm font-medium text-white/90">
          {[
            { label: 'Tất cả thuốc', to: '/products' },
            { label: 'Thuốc OTC', to: '/products?type=otc' },
            { label: 'Thuốc Rx', to: '/products?type=rx' },
            { label: 'Theo dõi đơn hàng', to: '/orders' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-white border-b-2 border-transparent hover:border-white
                         pb-1.5 transition-all whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Mobile menu drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white/90 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {[
                { label: '💊 Tất cả thuốc', to: '/products' },
                { label: '🟢 Thuốc OTC', to: '/products?type=otc' },
                { label: '🟡 Thuốc Rx (kê đơn)', to: '/products?type=rx' },
                { label: '🌿 Vitamin & TPCN', to: '/products?cat=vitamin' },
                { label: '📦 Theo dõi đơn hàng', to: '/orders' },
                { label: '👤 Tài khoản', to: '/profile' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm text-slate-700
                             hover:bg-slate-100 hover:text-black font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
