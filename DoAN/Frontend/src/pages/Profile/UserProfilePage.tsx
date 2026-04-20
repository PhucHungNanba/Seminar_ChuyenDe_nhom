import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, FileText, ShoppingBag, Bell, Shield,
  ChevronRight, CheckCircle, Clock, Calendar,
  Stethoscope, Hospital, RefreshCw, Eye, X,
  AlertTriangle, ShoppingCart,
} from 'lucide-react'
import {
  MOCK_PRESCRIPTIONS,
  type SavedPrescription,
} from '../../data/mockPrescriptionVault'
import { useCartStore } from '../../store/cartStore'

// ─── Sidebar nav items ────────────────────────────────────────────────────────
type NavKey = 'vault' | 'orders' | 'profile' | 'notifications' | 'security'

const NAV_ITEMS: { key: NavKey; icon: typeof FileText; label: string; sub?: string }[] = [
  { key: 'vault',         icon: FileText,   label: 'Sổ lưu đơn thuốc',   sub: `${MOCK_PRESCRIPTIONS.length} đơn` },
  { key: 'orders',        icon: ShoppingBag, label: 'Lịch sử đơn hàng',  sub: '12 đơn' },
  { key: 'profile',       icon: User,        label: 'Thông tin cá nhân' },
  { key: 'notifications', icon: Bell,        label: 'Thông báo' },
  { key: 'security',      icon: Shield,      label: 'Bảo mật & Quyền riêng tư' },
]

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'valid' | 'expired' }) {
  return status === 'valid' ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
      <CheckCircle className="w-3 h-3" /> Hợp lệ
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
      <Clock className="w-3 h-3" /> Hết hạn
    </span>
  )
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─── Prescription Detail Modal ────────────────────────────────────────────────
function PrescriptionModal({
  prx,
  onClose,
  onReorder,
}: {
  prx: SavedPrescription
  onClose: () => void
  onReorder: (p: SavedPrescription) => void
}) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-mono mb-1">{prx.prescriptionCode}</p>
            <h3 className="font-bold text-slate-800 text-lg">{prx.diagnosis}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Image + info */}
          <div className="flex gap-4">
            <img src={prx.thumbnailUrl} alt="Đơn thuốc" className="w-28 h-40 object-cover rounded-xl border border-slate-100 shrink-0" />
            <div className="flex flex-col gap-2 text-sm">
              <StatusBadge status={prx.status} />
              <div className="flex items-center gap-2 text-slate-600"><Stethoscope className="w-4 h-4 text-sky-400 shrink-0" />{prx.doctorName} — {prx.doctorSpecialty}</div>
              <div className="flex items-center gap-2 text-slate-600"><Hospital className="w-4 h-4 text-sky-400 shrink-0" />{prx.hospital}</div>
              <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4 text-sky-400 shrink-0" />Cấp: {fmt(prx.issuedDate)} — Hết hạn: {fmt(prx.expiryDate)}</div>
              {prx.notes && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200 mt-1 italic">📝 {prx.notes}</p>}
            </div>
          </div>

          {/* Medicines */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Danh sách thuốc ({prx.medicines.length})</p>
            <div className="flex flex-col gap-2">
              {prx.medicines.map((m) => (
                <div key={m.productId} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <img src={m.imageUrl} alt={m.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.dosage} · SL: {m.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-sky-700 shrink-0">{(m.price * m.quantity).toLocaleString('vi-VN')}đ</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {prx.status === 'valid' ? (
            <motion.button
              id={`modal-reorder-${prx.id}`}
              whileTap={{ scale: 0.97 }}
              onClick={() => { onReorder(prx); onClose() }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}
            >
              <ShoppingCart className="w-5 h-5" /> Mua lại theo đơn này
            </motion.button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-500 text-sm">
              <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0" />
              Đơn thuốc đã hết hạn. Vui lòng liên hệ bác sĩ để được cấp đơn mới.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Prescription Card ────────────────────────────────────────────────────────
function PrescriptionCard({
  prx,
  onView,
  onReorder,
}: {
  prx: SavedPrescription
  onView: () => void
  onReorder: (p: SavedPrescription) => void
}) {
  const [reordered, setReordered] = useState(false)

  function handleReorder() {
    onReorder(prx)
    setReordered(true)
    setTimeout(() => setReordered(false), 2000)
  }

  const daysLeft = Math.ceil((new Date(prx.expiryDate).getTime() - Date.now()) / 86400000)
  const isExpiringSoon = prx.status === 'valid' && daysLeft > 0 && daysLeft <= 30

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col
        ${prx.status === 'expired' ? 'border-slate-100 opacity-75' : 'border-slate-100'}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-slate-50">
        <img
          src={prx.thumbnailUrl}
          alt="Đơn thuốc"
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Status overlay */}
        <div className="absolute top-3 left-3"><StatusBadge status={prx.status} /></div>
        {isExpiringSoon && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">
              Còn {daysLeft} ngày
            </span>
          </div>
        )}
        {prx.status === 'expired' && (
          <div className="absolute inset-0 bg-slate-900/20" />
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Code */}
        <p className="text-[10px] font-mono text-slate-400 truncate">{prx.prescriptionCode}</p>

        {/* Diagnosis */}
        <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{prx.diagnosis}</p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{prx.doctorName} · {prx.doctorSpecialty}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Cấp: {fmt(prx.issuedDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className={prx.status === 'expired' ? 'text-slate-400 line-through' : isExpiringSoon ? 'text-orange-600 font-medium' : ''}>
              HSD: {fmt(prx.expiryDate)}
            </span>
          </div>
        </div>

        {/* Medicine pills */}
        <div className="flex flex-wrap gap-1">
          {prx.medicines.map((m) => (
            <span key={m.productId} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium truncate max-w-[120px]">
              {m.name}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            id={`view-prx-${prx.id}`}
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Xem chi tiết
          </button>

          {prx.status === 'valid' && (
            <motion.button
              id={`reorder-prx-${prx.id}`}
              onClick={handleReorder}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl text-white transition-all duration-200"
              style={{
                background: reordered
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
              }}
            >
              {reordered ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Đã thêm!</>
              ) : (
                <><RefreshCw className="w-3.5 h-3.5" /> Mua lại</>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── PrescriptionVault ────────────────────────────────────────────────────────
function PrescriptionVault() {
  const addItem = useCartStore((s) => s.addItem)
  const setPrescription = useCartStore((s) => s.setPrescription)
  const [selected, setSelected] = useState<SavedPrescription | null>(null)
  const [filter, setFilter] = useState<'all' | 'valid' | 'expired'>('all')
  const [toast, setToast] = useState('')

  const displayed = filter === 'all'
    ? MOCK_PRESCRIPTIONS
    : MOCK_PRESCRIPTIONS.filter((p) => p.status === filter)

  // Map Rx medicines → cart, auto-attach prescription thumbnail
  function handleReorder(prx: SavedPrescription) {
    prx.medicines.forEach((med) => {
      addItem({ id: med.productId, name: med.name, type: 'rx', price: med.price, quantity: med.quantity, imageUrl: med.imageUrl })
      setPrescription(med.productId, {
        fileUrl: prx.thumbnailUrl,
        fileName: `${prx.prescriptionCode}.jpg`,
        uploadedAt: new Date().toISOString(),
      })
    })
    setToast(`Đã thêm ${prx.medicines.length} thuốc vào giỏ hàng!`)
    setTimeout(() => setToast(''), 3000)
  }

  const validCount = MOCK_PRESCRIPTIONS.filter((p) => p.status === 'valid').length
  const expiredCount = MOCK_PRESCRIPTIONS.filter((p) => p.status === 'expired').length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Sổ lưu đơn thuốc</h2>
          <p className="text-sm text-slate-500 mt-0.5">{validCount} hợp lệ · {expiredCount} hết hạn</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {([['all', 'Tất cả'], ['valid', 'Hợp lệ'], ['expired', 'Hết hạn']] as const).map(([k, label]) => (
            <button
              key={k}
              id={`vault-filter-${k}`}
              onClick={() => setFilter(k)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                filter === k ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '1.25rem' }}>
        <AnimatePresence mode="popLayout">
          {displayed.map((prx) => (
            <PrescriptionCard
              key={prx.id}
              prx={prx}
              onView={() => setSelected(prx)}
              onReorder={handleReorder}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <PrescriptionModal prx={selected} onClose={() => setSelected(null)} onReorder={handleReorder} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 12, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl"
          >
            <ShoppingCart className="w-4 h-4" /> {toast}
            <Link to="/cart" className="underline ml-1 text-emerald-200 hover:text-white">Xem giỏ hàng →</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Placeholder panels ───────────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Bell className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-slate-600 font-semibold">{label}</h3>
      <p className="text-slate-400 text-sm mt-1">Tính năng đang được phát triển.</p>
    </div>
  )
}

// ─── UserProfilePage ──────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const [activeNav, setActiveNav] = useState<NavKey>('vault')
  const navigate = useNavigate()

  const MOCK_USER = { name: 'Nguyễn Thị Thanh Hà', email: 'thanhha@gmail.com', phone: '0912 345 678', avatar: 'https://placehold.co/80x80/e0f2fe/0284c7?text=TH' }

  return (
    <div className="max-w-6xl mx-auto flex gap-7 items-start">

      {/* ════ Sidebar ════ */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-4 sticky top-6">

        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
          <div className="relative">
            <img src={MOCK_USER.avatar} alt="Avatar" className="w-16 h-16 rounded-full ring-4 ring-sky-100" />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{MOCK_USER.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{MOCK_USER.email}</p>
          </div>
          <div className="w-full h-px bg-slate-100" />
          <div className="flex gap-4 text-center w-full">
            {[{ label: 'Đơn thuốc', value: MOCK_PRESCRIPTIONS.length }, { label: 'Đơn hàng', value: 12 }].map((s) => (
              <div key={s.label} className="flex-1">
                <p className="text-base font-bold text-sky-600">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeNav === item.key
            return (
              <button
                key={item.key}
                id={`profile-nav-${item.key}`}
                onClick={() => setActiveNav(item.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all w-full group ${
                  active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-sky-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${active ? 'text-sky-700' : ''}`}>{item.label}</p>
                  {item.sub && <p className="text-xs text-slate-400">{item.sub}</p>}
                </div>
                {active && <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />}
              </button>
            )
          })}
        </nav>

        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors text-center py-1"
        >
          Đăng xuất
        </button>
      </aside>

      {/* ════ Main Content ════ */}
      <main className="flex-1 min-w-0">
        {/* Mobile: breadcrumb nav */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeNav === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl shrink-0 transition-all ${
                  active ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeNav === 'vault'   && <PrescriptionVault />}
            {activeNav === 'orders'  && (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-slate-600 font-semibold mb-2">Quản lý lịch sử đơn hàng</h3>
                <button onClick={() => navigate('/orders')} className="mt-2 text-sky-600 hover:text-sky-700 font-medium border border-sky-300 px-5 py-2.5 rounded-xl hover:bg-sky-50 transition-colors">
                  Đi đến danh sách đơn hàng
                </button>
              </div>
            )}
            {activeNav === 'profile' && <ComingSoon label="Thông tin cá nhân" />}
            {activeNav === 'notifications' && <ComingSoon label="Thông báo" />}
            {activeNav === 'security' && <ComingSoon label="Bảo mật" />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
