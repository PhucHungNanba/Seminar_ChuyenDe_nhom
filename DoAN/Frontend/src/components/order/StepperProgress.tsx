import { useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardList, Package, Truck, CheckCircle2
} from 'lucide-react'

// ── Step definitions ────────────────────────────────
export const ORDER_STEPS = [
  { key: 'pending',   label: 'Chờ duyệt',          icon: ClipboardList, desc: 'Đơn hàng đang chờ xác nhận' },
  { key: 'packing',  label: 'Dược sĩ đóng gói',    icon: Package,       desc: 'Dược sĩ đang chuẩn bị thuốc' },
  { key: 'shipping', label: 'Đang giao hàng',       icon: Truck,         desc: 'Nhân viên đang trên đường giao' },
  { key: 'done',     label: 'Đã nhận hàng',         icon: CheckCircle2,  desc: 'Đơn hàng hoàn thành' },
] as const

export type StepKey = typeof ORDER_STEPS[number]['key']

// Map key → numeric index
const STEP_INDEX: Record<StepKey, number> = {
  pending: 0, packing: 1, shipping: 2, done: 3,
}

interface Props {
  currentStep: StepKey
}

export default function StepperProgress({ currentStep }: Props) {
  const current = STEP_INDEX[currentStep]
  const lineRef = useRef<HTMLDivElement>(null)

  // Progress: 0 at step 0, 100% at step 3
  const progressPct = current / (ORDER_STEPS.length - 1)

  return (
    <div className="w-full">
      {/* ── Connector track + step dots ── */}
      <div className="relative flex items-center justify-between" ref={lineRef}>

        {/* Grey base track */}
        <div className="absolute inset-x-0 top-5 h-1 bg-slate-200 rounded-full z-0" />

        {/* ── Animated green fill ── */}
        <motion.div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500
                     rounded-full z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progressPct }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          style={{ width: '100%', transformOrigin: 'left' }}
        />

        {/* ── Step nodes ── */}
        {ORDER_STEPS.map((step, idx) => {
          const done      = idx < current
          const active    = idx === current
          const upcoming  = idx > current
          const Icon      = step.icon

          return (
            <div key={step.key} className="relative z-20 flex flex-col items-center gap-2 flex-1">
              {/* Circle */}
              <motion.div
                initial={false}
                animate={
                  done    ? { scale: 1, backgroundColor: '#10b981', borderColor: '#10b981' } :
                  active  ? { scale: 1.1, backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' } :
                            { scale: 1, backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
                }
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                style={{ backgroundColor: upcoming ? '#f8fafc' : undefined }}
              >
                {done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                ) : active ? (
                  /* Pulsing ring for active step */
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-sky-400"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <Icon className="w-5 h-5 text-white relative z-10" />
                  </div>
                ) : (
                  <Icon className="w-4 h-4 text-slate-400" />
                )}
              </motion.div>

              {/* Label */}
              <span className={`text-xs font-semibold text-center leading-tight max-w-[72px]
                               ${done ? 'text-emerald-600' : active ? 'text-sky-600' : 'text-slate-400'}`}>
                {step.label}
              </span>

              {/* Timestamp placeholder */}
              {(done || active) && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] text-center ${done ? 'text-emerald-500' : 'text-sky-400'}`}
                >
                  {done ? '✓ Hoàn tất' : 'Đang xử lý'}
                </motion.span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Current step description ── */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mt-6 px-4 py-3 rounded-xl text-sm text-center font-medium
                    ${currentStep === 'done'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
      >
        {ORDER_STEPS[STEP_INDEX[currentStep]].desc}
      </motion.div>
    </div>
  )
}
