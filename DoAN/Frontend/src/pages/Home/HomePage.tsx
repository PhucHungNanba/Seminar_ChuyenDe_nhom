import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  ClipboardList,
  ShoppingBag,
  Stethoscope,
  ArrowRight,
  ShoppingCart,
  Pill,
  Activity,
  BadgeCheck,
  ChevronRight,
  Lock,
  Zap,
  Heart,
} from 'lucide-react'
import { useFeaturedStore, type FeaturedProduct } from '../../store/featuredStore'
import { useCartStore } from '../../store/cartStore'
import { useState } from 'react'
import QuickPrescriptionModal from '../../components/home/QuickPrescriptionModal'

// ─── Fade-up animation preset ───────────────────────────────────────────────
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

// ════════════════════════════════════════════════════════════════════════════
// Section 1 — HeroBanner
// ════════════════════════════════════════════════════════════════════════════
function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-12">
      {/* Gradient background */}
      <div
        style={{
          background:
            'linear-gradient(135deg, #0369a1 0%, #0284c7 35%, #0ea5e9 65%, #38bdf8 100%)',
        }}
        className="absolute inset-0"
      />

      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #bae6fd, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #7dd3fc, transparent 70%)' }}
      />

      {/* Floating pill icons */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-12 opacity-20 hidden lg:block"
      >
        <Pill className="w-24 h-24 text-white" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-8 right-40 opacity-15 hidden lg:block"
      >
        <Activity className="w-16 h-16 text-white" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 max-w-3xl">
        {/* Trust badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6"
        >
          <BadgeCheck className="w-4 h-4 text-emerald-300" />
          Được cấp phép bởi Bộ Y Tế Việt Nam
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
        >
          Sức khỏe của bạn{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #bae6fd, #e0f2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            là ưu tiên
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-sky-100 text-lg sm:text-xl mb-8 max-w-xl leading-relaxed"
        >
          Thuốc chính hãng, giao hàng nhanh tận nơi. Đội ngũ dược sĩ tư vấn 24/7 — đảm bảo
          an toàn, tin cậy cho mọi gia đình Việt.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-wrap gap-4"
        >
          <Link
            to="/products"
            id="hero-cta-catalog"
            className="group inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-5 h-5" />
            Xem danh mục thuốc
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/orders"
            id="hero-cta-track"
            className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <ClipboardList className="w-5 h-5" />
            Tra cứu đơn hàng
          </Link>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="flex flex-wrap gap-8 mt-10 text-white"
        >
          {[
            { value: '10.000+', label: 'Sản phẩm' },
            { value: '500K+', label: 'Khách hàng' },
            { value: '4.9★', label: 'Đánh giá' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sky-200 text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Trust row */}
      <div
        className="relative z-10 border-t border-white/20 px-8 sm:px-16 py-5 flex flex-wrap gap-6 bg-white/5 backdrop-blur-md"
      >
        {[
          { icon: ShieldCheck, text: 'Thuốc chính hãng 100%' },
          { icon: Zap, text: 'Giao hàng trong 2 giờ' },
          { icon: Heart, text: 'Tư vấn dược sĩ miễn phí' },
          { icon: Lock, text: 'Bảo mật thông tin bệnh nhân' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-white/80 text-sm">
            <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Section 2 — CategoryGrid
// ════════════════════════════════════════════════════════════════════════════
const CATEGORIES = [
  {
    id: 'cat-rx',
    icon: ClipboardList,
    label: 'Thuốc kê đơn',
    sublabel: 'Rx — Cần đơn thuốc bác sĩ',
    description: 'Kháng sinh, thuốc điều trị mãn tính, thuốc đặc trị...',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#fde68a',
    iconBg: '#fef3c7',
    badgeColor: '#d97706',
    to: '/products?type=rx'
  },
  {
    id: 'cat-otc',
    icon: ShoppingBag,
    label: 'Thuốc không kê đơn',
    sublabel: 'OTC — Mua tự do',
    description: 'Hạ sốt, giảm đau, vitamin, kháng histamine...',
    color: '#0ea5e9',
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    border: '#bae6fd',
    iconBg: '#e0f2fe',
    badgeColor: '#0284c7',
    to: '/products?type=otc'
  },
  {
    id: 'cat-med',
    icon: Stethoscope,
    label: 'Vật tư y tế',
    sublabel: 'Thiết bị & dụng cụ',
    description: 'Nhiệt kế, máy đo huyết áp, băng gạc, khẩu trang...',
    color: '#10b981',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
    border: '#6ee7b7',
    iconBg: '#d1fae5',
    badgeColor: '#059669',
    to: '/products?form=device'
  },
]

function CategoryGrid() {
  const navigate = useNavigate()

  return (
    <section className="mb-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Danh mục sản phẩm</h2>
          <p className="text-slate-500 text-sm mt-1">Chọn nhóm thuốc phù hợp với nhu cầu của bạn</p>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-1 text-sky-600 text-sm font-medium hover:text-sky-700 transition-colors"
        >
          Xem tất cả <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon
          return (
            <motion.button
              key={cat.id}
              id={cat.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              onClick={() => navigate(cat.to)}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer"
              style={{
                background: cat.bg,
                borderColor: cat.border,
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: cat.iconBg }}
              >
                <Icon style={{ color: cat.color }} className="w-7 h-7" />
              </div>

              {/* Badge */}
              <span
                className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2"
                style={{
                  background: cat.iconBg,
                  color: cat.badgeColor,
                  border: `1px solid ${cat.border}`,
                }}
              >
                {cat.sublabel}
              </span>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{cat.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{cat.description}</p>

              {/* Arrow */}
              <div
                className="flex items-center gap-1 mt-4 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: cat.color }}
              >
                Xem ngay <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Section 3 — FeaturedProducts
// ════════════════════════════════════════════════════════════════════════════
function ProductCard({ product, index }: { product: FeaturedProduct; index: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
    'Bán chạy': { bg: '#fef3c7', text: '#d97706' },
    'Yêu thích': { bg: '#fce7f3', text: '#db2777' },
    'Mới': { bg: '#ede9fe', text: '#7c3aed' },
    'Sale': { bg: '#fee2e2', text: '#dc2626' },
  }

  const inStock = (product.stock_quantity ?? product.quantity ?? 0) > 0

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={index * 0.05}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200 flex flex-col h-full overflow-hidden"
    >
      {/* Image area */}
      <div className="relative bg-white aspect-square flex items-center justify-center p-4 border-b border-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rx/OTC Badge overlay */}
        <span className={`absolute top-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${product.type === 'rx' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {product.type === 'rx' ? 'Rx' : 'OTC'}
        </span>
        {/* Badge overlay */}
        {product.badge && BADGE_STYLE[product.badge] && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: BADGE_STYLE[product.badge].bg,
              color: BADGE_STYLE[product.badge].text,
            }}
          >
            {product.badge}
          </span>
        )}
        {/* Stock badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-slate-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 text-left">
        <div className="h-2" />

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          id={`product-card-${product.id}`}
          className="font-bold text-gray-800 text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2 mb-1"
        >
          {product.name}
        </Link>
        <p className="text-xs text-slate-400 mb-1">{product.manufacturer}</p>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

        {/* Price & Action */}
        <div className="flex flex-col mt-auto pt-3 gap-3">
          <div>
            <p className="text-lg font-bold text-blue-700">
              {product.price.toLocaleString('vi-VN')}đ
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">/ {product.unit}</p>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="w-full py-2 rounded-lg text-sm font-semibold transition-colors border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
            >
              Xem chi tiết
            </button>
            <motion.button
              id={`add-to-cart-${product.id}`}
              onClick={() => {
                if (product.type === 'rx') {
                  navigate(`/products/${product.id}`)
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

function FeaturedProducts() {
  const products = useFeaturedStore((s) => s.products)

  return (
    <section className="mb-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sản phẩm nổi bật</h2>
          <p className="text-slate-500 text-sm mt-1">
            Được lựa chọn bởi đội ngũ dược sĩ PharmaCare
          </p>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-1 text-sky-600 text-sm font-medium hover:text-sky-700 transition-colors"
        >
          Xem tất cả <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* CSS Grid: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Mobile "View all" */}
      <div className="flex justify-center mt-8 sm:hidden">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sky-600 font-semibold border border-sky-300 px-6 py-2.5 rounded-xl hover:bg-sky-50 transition-colors"
        >
          Xem tất cả sản phẩm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Main Export — HomePage
// ════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [rxModalOpen, setRxModalOpen] = useState(false)

  return (
    <div id="home-page">
      <QuickPrescriptionModal open={rxModalOpen} onClose={() => setRxModalOpen(false)} />
      
      {/* ── RX BANNER (Gửi Toa Thuốc) ── */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-white max-w-xl">
            <h2 className="text-2xl font-bold mb-2">Mua thuốc qua hình chụp/toa thuốc</h2>
            <p className="text-blue-100">Bạn có toa thuốc? Chỉ cần gửi hình, dược sĩ sẽ báo giá và giao hàng tận nơi trong 2 giờ!</p>
          </div>
          <button
            onClick={() => setRxModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-700 rounded-md font-bold hover:bg-blue-50 transition-colors shrink-0 whitespace-nowrap"
          >
            Gửi Toa Thuốc Ngay
          </button>
        </div>
      </section>

      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  )
}
