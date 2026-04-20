// Reusable OTC / Rx type badge — used in CartItem, MedicineDetail, ProductCard, OrderDetail
interface Props {
  type: 'otc' | 'rx'
  size?: 'sm' | 'md'
}

export default function TypeBadge({ type, size = 'sm' }: Props) {
  const base = size === 'md'
    ? 'px-3 py-1.5 text-sm rounded-full font-bold inline-flex items-center gap-1.5'
    : 'px-2.5 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1'

  // OTC — green: safe, no prescription needed
  if (type === 'otc') {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700 border border-emerald-300`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        Thuốc Không Kê Đơn
      </span>
    )
  }

  // Rx — red: prescription required, must stand out
  return (
    <span className={`${base} bg-red-100 text-red-700 border border-red-300`}>
      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
      Thuốc Kê Đơn (Rx)
    </span>
  )
}
