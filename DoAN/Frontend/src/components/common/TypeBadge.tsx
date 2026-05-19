// Reusable type badge — used in CartItem, MedicineDetail, ProductCard, OrderDetail
interface Props {
  type: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device'
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

  // Vitamin & TPCN - purple
  if (type === 'vitamin') {
    return (
      <span className={`${base} bg-purple-100 text-purple-700 border border-purple-300`}>
        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
        Vitamin & TPCN
      </span>
    )
  }

  // Personal Care - cyan
  if (type === 'personal_care') {
    return (
      <span className={`${base} bg-cyan-100 text-cyan-700 border border-cyan-300`}>
        <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
        Chăm sóc cá nhân
      </span>
    )
  }

  // Medical Device - amber
  if (type === 'medical_device') {
    return (
      <span className={`${base} bg-amber-100 text-amber-700 border border-amber-300`}>
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        Thiết bị y tế
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
