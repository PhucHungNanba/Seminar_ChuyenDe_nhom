import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Package,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { type AssociationRule } from '../../types'
import { useCartStore } from '../../store/cartStore'
import TypeBadge from '../common/TypeBadge'

interface FrequentlyBoughtTogetherProps {
  associationRulesData?: AssociationRule[]
  currentProductIds?: string[]
  title?: string
  maxItems?: number
  isLoading?: boolean
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const style =
    pct >= 70
      ? { bg: '#dcfce7', text: '#16a34a' }
      : pct >= 50
        ? { bg: '#fef9c3', text: '#ca8a04' }
        : { bg: '#f1f5f9', text: '#64748b' }

  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ background: style.bg, color: style.text }}
    >
      {pct}% mua kèm
    </span>
  )
}

function FbtCard({ rule }: { rule: AssociationRule }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const { consequent } = rule
  
  const imgUrl = (consequent.images && consequent.images.length > 0) ? consequent.images[0] : 'https://placehold.co/320x320/e2e8f0/64748b?text=No+Image'

  function handleAdd() {
    addItem({
      id: consequent._id,
      name: consequent.name,
      type: consequent.type,
      price: consequent.price,
      quantity: 1,
      imageUrl: imgUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="group flex-none w-44 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative bg-slate-50 overflow-hidden">
        <img
          src={imgUrl}
          alt={consequent.name}
          className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {rule.lift >= 2.5 && (
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-0.5 text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded-full">
              <TrendingUp className="w-2.5 h-2.5" />
              Phổ biến
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-2">
        <TypeBadge type={consequent.type} size="sm" />

        <Link
          to={`/products/${consequent._id}`}
          id={`fbt-product-${consequent._id}`}
          className="text-xs font-semibold text-slate-800 hover:text-sky-600 transition-colors line-clamp-2 leading-snug"
        >
          {consequent.name}
        </Link>

        <div className="flex flex-col gap-1">
          <ConfidencePill confidence={rule.confidence} />
          {rule.reason && (
            <p className="text-[10px] text-slate-400 italic leading-tight">
              "{rule.reason}"
            </p>
          )}
        </div>

        <div className="mt-auto pt-1 flex items-center justify-between gap-1">
          <div>
            <p className="text-sm font-bold text-sky-700">
              {consequent.price?.toLocaleString('vi-VN')}đ
            </p>
          </div>

          {consequent.type === 'rx' ? (
            <Link
              to={`/products/${consequent._id}`}
              className="flex items-center gap-0.5 text-[10px] font-semibold px-2 py-1.5 rounded-lg border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors shrink-0"
            >
              <Package className="w-3 h-3" />
              Chi tiết
            </Link>
          ) : (
            <motion.button
              id={`fbt-add-${consequent._id}`}
              onClick={handleAdd}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-0.5 text-[10px] font-semibold px-2 py-1.5 rounded-lg text-white shrink-0 transition-all duration-200"
              style={{
                background: added
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
              }}
            >
              <ShoppingCart className="w-3 h-3" />
              {added ? '✓' : 'Thêm'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FbtSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex-none w-44 bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
        >
          <div className="w-full h-36 bg-slate-100" />
          <div className="p-3 flex flex-col gap-2">
            <div className="h-3 bg-slate-100 rounded w-16" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FrequentlyBoughtTogether({
  associationRulesData = [],
  currentProductIds = [],
  title = 'Thường được mua cùng nhau',
  maxItems = 8,
  isLoading = false,
}: FrequentlyBoughtTogetherProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const rules = associationRulesData
    .filter((r) => r.consequent && !currentProductIds.includes(r.consequent._id))
    .slice(0, maxItems)

  if (!isLoading && rules.length === 0) return null

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const amount = 220 * 2
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  function onScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  return (
    <motion.section
      id="frequently-bought-together"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mt-10 bg-gradient-to-br from-sky-50 to-white rounded-3xl border border-sky-100 p-6"
    >
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dựa trên hành vi mua sắm của <span className="text-sky-500 font-medium">500.000+ khách hàng</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <FbtSkeleton />
      ) : (
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence>
            {rules.map((rule, i) => (
              <motion.div
                key={rule._id || i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <FbtCard rule={rule} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="text-[10px] text-slate-300 mt-3 text-right italic">
        Gợi ý được tính toán bằng thuật toán Association Rule Mining
        (confidence ≥ 44%, lift ≥ 1.8)
      </p>
    </motion.section>
  )
}
