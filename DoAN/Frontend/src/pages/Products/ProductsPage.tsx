import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ChangeEvent,
} from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingCart,
  ChevronDown,
  Filter,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { type Product, type ProductForm } from '../../types'
import { useCartStore } from '../../store/cartStore'
import { useFeaturedStore } from '../../store/featuredStore'
import { formatDisplayId } from '../../utils/formatHelpers'

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────
type SortKey = 'default' | 'price_asc' | 'price_desc' | 'name_asc'

interface Filters {
  types: Set<'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device'>
  forms: Set<ProductForm>
}

const FORM_LABELS: Record<ProductForm, string> = {
  tablet: 'Viên nén / Viên sủi',
  effervescent: 'Viên nén / Viên sủi',
  capsule: 'Viên nang',
  liquid: 'Dạng nước / Siro',
  device: 'Dụng cụ / Thiết bị',
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên A → Z' },
]

const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  'Bán chạy': { bg: '#fef3c7', text: '#d97706' },
  'Yêu thích': { bg: '#fce7f3', text: '#db2777' },
  'Mới': { bg: '#ede9fe', text: '#7c3aed' },
  'Sale': { bg: '#fee2e2', text: '#dc2626' },
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  // Xử lý lấy ảnh từ array
  const imgUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://placehold.co/320x320/e2e8f0/64748b?text=No+Image'

  function handleAdd() {
    addItem({
      id: product._id,
      name: product.name,
      type: product.type,
      price: product.price,
      quantity: 1,
      imageUrl: imgUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  // Tính inStock dựa vào field tồn kho
  const inStock = (product.stock_quantity ?? 0) > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200 flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <div className="relative bg-white aspect-square flex items-center justify-center p-4 border-b border-gray-100">
        <img
          src={imgUrl}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rx/OTC Badge overlay */}
        <span className={`absolute top-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${product.type === 'rx' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {product.type === 'rx' ? 'Rx' : 'OTC'}
        </span>
        {product.badge && BADGE_STYLE[product.badge] && (
          <span
            className="absolute top-2.5 left-2.5 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: BADGE_STYLE[product.badge].bg,
              color: BADGE_STYLE[product.badge].text,
            }}
          >
            {product.badge}
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-slate-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1 text-left">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
            {FORM_LABELS[product.form] || product.form}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            {product.productCode || formatDisplayId(product._id, 'MED')}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          id={`products-card-${product._id}`}
          className="font-bold text-gray-800 text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2 mb-1"
        >
          {product.name}
        </Link>
        <p className="text-xs text-slate-400 mb-1">{product.manufacturer}</p>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex flex-col mt-auto pt-3 gap-3">
          <div>
            <p className="text-lg font-bold text-blue-700">
              {product.price?.toLocaleString('vi-VN')}đ
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">/ {product.unit}</p>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={() => navigate(`/products/${product._id}`)}
              className="w-full py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
            >
              Xem chi tiết
            </button>
            <motion.button
              id={`products-add-${product._id}`}
              onClick={() => {
                if (product.type === 'rx') {
                  navigate(`/products/${product._id}`)
                  return
                }
                handleAdd()
              }}
              disabled={!inStock}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {product.type === 'rx' ? 'Mua thuốc kê đơn' : (added ? 'Đã thêm ✓' : 'Chọn mua')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CheckboxGroup helper
// ─────────────────────────────────────────────────────────────────────────────
function CheckboxItem({
  id,
  label,
  checked,
  onChange,
  count,
}: {
  id: string
  label: string
  checked: boolean
  onChange: () => void
  count: number
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-2 cursor-pointer group py-1"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150"
          style={{
            borderColor: checked ? '#0ea5e9' : '#cbd5e1',
            background: checked ? '#0ea5e9' : 'white',
          }}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <span className={`text-sm transition-colors ${checked ? 'text-sky-700 font-medium' : 'text-slate-600 group-hover:text-slate-800'}`}>
          {label}
        </span>
      </div>
      <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FilterSidebar content (shared between sidebar + drawer)
// ─────────────────────────────────────────────────────────────────────────────
function SidebarContent({
  filters,
  onToggleType,
  onToggleForm,
  onReset,
  products,
}: {
  filters: Filters
  onToggleType: (t: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device') => void
  onToggleForm: (f: ProductForm) => void
  onReset: () => void
  products: Product[]
}) {
  const hasActive =
    filters.types.size > 0 || filters.forms.size > 0

  const countType = (t: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device') => products.filter((p) => p.type === t).length
  const countForm = (f: ProductForm) => {
    if (f === 'tablet') {
      return products.filter((p) => p.form === 'tablet' || p.form === 'effervescent').length
    }
    return products.filter((p) => p.form === f).length
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-500" />
          <span className="font-semibold text-slate-800">Bộ lọc</span>
          {hasActive && (
            <span className="text-xs bg-sky-500 text-white px-1.5 py-0.5 rounded-full">
              {filters.types.size + filters.forms.size}
            </span>
          )}
        </div>
        {hasActive && (
          <button
            onClick={onReset}
            id="filter-reset-btn"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Xoá lọc
          </button>
        )}
      </div>

      <hr className="border-slate-100" />

      {/* Loại thuốc */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Loại thuốc
        </p>
        <div className="flex flex-col gap-0.5">
          <CheckboxItem
            id="filter-type-otc"
            label="Không kê đơn (OTC)"
            checked={filters.types.has('otc')}
            onChange={() => onToggleType('otc')}
            count={countType('otc')}
          />
          <CheckboxItem
            id="filter-type-rx"
            label="Thuốc kê đơn (Rx)"
            checked={filters.types.has('rx')}
            onChange={() => onToggleType('rx')}
            count={countType('rx')}
          />
          <CheckboxItem
            id="filter-type-vitamin"
            label="Vitamin & TPCN"
            checked={filters.types.has('vitamin')}
            onChange={() => onToggleType('vitamin')}
            count={countType('vitamin')}
          />
          <CheckboxItem
            id="filter-type-personal-care"
            label="Chăm sóc cá nhân"
            checked={filters.types.has('personal_care')}
            onChange={() => onToggleType('personal_care')}
            count={countType('personal_care')}
          />
          <CheckboxItem
            id="filter-type-medical-device"
            label="Thiết bị y tế"
            checked={filters.types.has('medical_device')}
            onChange={() => onToggleType('medical_device')}
            count={countType('medical_device')}
          />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Dạng bào chế */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Dạng bào chế
        </p>
        <div className="flex flex-col gap-0.5">
          {(['tablet', 'capsule', 'liquid', 'device'] as ProductForm[]).map((form) => (
            <CheckboxItem
              key={form}
              id={`filter-form-${form}`}
              label={FORM_LABELS[form]}
              checked={filters.forms.has(form)}
              onChange={() => onToggleForm(form)}
              count={countForm(form)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Drawer
// ─────────────────────────────────────────────────────────────────────────────
function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.aside
            key="drawer-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-semibold text-slate-800">Bộ lọc sản phẩm</span>
              <button
                onClick={onClose}
                id="drawer-close-btn"
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            <div className="px-5 py-4 border-t border-slate-100">
              <button
                onClick={onClose}
                id="drawer-apply-btn"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductsPage
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { products, isLoading, error, fetchProducts } = useFeaturedStore()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('default')
  const [filters, setFilters] = useState<Filters>({ types: new Set(), forms: new Set() })
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Gọi API lấy dữ liệu khi mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const q    = searchParams.get('q')
    const type = searchParams.get('type')
    const form = searchParams.get('form') as ProductForm | null

    if (q) setQuery(q)
    if (type && ['otc', 'rx', 'vitamin', 'personal_care', 'medical_device'].includes(type)) {
      setFilters((prev) => ({ ...prev, types: new Set([type as any]) }))
    }
    if (form && ['tablet','capsule','liquid','device','effervescent'].includes(form)) {
      setFilters((prev) => ({ ...prev, forms: new Set([form]) }))
    }
  }, [searchParams])

  const toggleType = useCallback((t: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device') => {
    setFilters((prev) => {
      const next = new Set(prev.types)
      next.has(t) ? next.delete(t) : next.add(t)
      return { ...prev, types: next }
    })
  }, [])

  const toggleForm = useCallback((f: ProductForm) => {
    setFilters((prev) => {
      const next = new Set(prev.forms)
      next.has(f) ? next.delete(f) : next.add(f)
      return { ...prev, forms: next }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ types: new Set(), forms: new Set() })
  }, [])

  const results = useMemo(() => {
    let list = products || []

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.genericName?.toLowerCase().includes(q) ||
          p.manufacturer?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (filters.types.size > 0) {
      list = list.filter((p) => filters.types.has(p.type))
    }

    if (filters.forms.size > 0) {
      list = list.filter((p) => {
        if (filters.forms.has('tablet') && (p.form === 'tablet' || p.form === 'effervescent')) {
          return true
        }
        return filters.forms.has(p.form)
      })
    }

    const sorted = [...list]
    switch (sortKey) {
      case 'price_asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name_asc':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'vi'))
        break
    }
    return sorted
  }, [products, query, filters, sortKey])

  const activeFilterCount = filters.types.size + filters.forms.size

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
        <button onClick={() => fetchProducts()} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded">Thử lại</button>
      </div>
    )
  }

  return (
    <>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SidebarContent
          filters={filters}
          onToggleType={toggleType}
          onToggleForm={toggleForm}
          onReset={resetFilters}
          products={products}
        />
      </MobileDrawer>

      <div className="flex gap-7">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <SidebarContent
              filters={filters}
              onToggleType={toggleType}
              onToggleForm={toggleForm}
              onReset={resetFilters}
              products={products}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Danh mục thuốc</h1>
            <p className="text-slate-500 text-sm mt-1">
              {results.length.toLocaleString()} sản phẩm
              {query && <> khớp với "<strong>{query}</strong>"</>}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="products-search-input"
                type="text"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Tìm thuốc, thành phần, nhà sản xuất…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                id="products-sort-select"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button
              id="mobile-filter-btn"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              Lọc
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-5"
            >
              {Array.from(filters.types).map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  {t === 'otc' ? 'OTC' : t === 'rx' ? 'Kê đơn (Rx)' : t === 'vitamin' ? 'Vitamin & TPCN' : t === 'personal_care' ? 'Chăm sóc cá nhân' : 'Thiết bị y tế'}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {Array.from(filters.forms).map((f) => (
                <button
                  key={f}
                  onClick={() => toggleForm(f)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-sky-100 text-sky-700 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  {FORM_LABELS[f]}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 px-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Xoá tất cả
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <motion.div
                key="grid"
                layout
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {results.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-700 font-semibold mb-1">Không tìm thấy sản phẩm</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Thử tìm với từ khóa khác hoặc bỏ bớt bộ lọc.
                </p>
                <button
                  onClick={() => { setQuery(''); resetFilters() }}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium border border-sky-300 px-5 py-2 rounded-xl hover:bg-sky-50 transition-colors"
                >
                  Xoá tìm kiếm &amp; lọc
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
