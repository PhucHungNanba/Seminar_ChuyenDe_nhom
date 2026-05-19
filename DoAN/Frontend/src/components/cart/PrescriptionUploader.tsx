import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle2, FileText, X } from 'lucide-react'
import { useCartStore, CartItem } from '../../store/cartStore'
import PrescriptionModal from './PrescriptionModal'

type RequestPayload = { fileUrl: string; fileName: string; uploadedAt: string; file?: File }

type Props =
  | {
      item: CartItem
      mode?: 'cart'
    }
  | {
      mode: 'request'
      productName: string
      onSubmit: (payload: RequestPayload) => void | Promise<boolean | void> | boolean
      buttonLabel?: string
      disabled?: boolean
    }

export default function PrescriptionUploader(props: Props) {
  const setPrescription = useCartStore((s) => s.setPrescription)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (props.mode === 'request') {
    return (
      <div className="w-full">
        <PrescriptionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode="request"
          productName={props.productName}
          onConfirm={async (payload) => {
            const accepted = await props.onSubmit(payload)
            if (accepted === false) return false
            setSubmitted(true)
            return true
          }}
        />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="request-btn"
              id="btn-rx-request"
              onClick={() => setModalOpen(true)}
              disabled={props.disabled}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6
                         rounded-full font-bold text-[15px] transition-all
                         ${props.disabled
                           ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                           : 'bg-black text-white hover:bg-slate-800'
                         }`}
            >
              <Upload className="w-4 h-4" />
              {props.buttonLabel || 'Gửi yêu cầu kê đơn'}
            </motion.button>
          ) : (
            <motion.div
              key="request-submitted"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50
                         text-emerald-700 font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Yêu cầu đã gửi. Dược sĩ sẽ báo giá sớm.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const { item } = props

  function removePrescription() {
    setPrescription(item.id, null)
  }

  const isImage = item.prescription?.fileName
    ? /\.(jpg|jpeg|png|gif|webp)$/i.test(item.prescription.fileName)
    : false

  return (
    <div className="mt-3 ml-1">
      {/* ── Slide-up modal (Portal) ── */}
      <PrescriptionModal
        item={item}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <AnimatePresence mode="wait">

        {/* ── State 1: No prescription yet ── */}
        {!item.prescription && (
          <motion.div
            key="upload-prompt"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {/* Open modal trigger - Modern Dropzone */}
            <motion.button
              id={`open-rx-modal-${item.id}`}
              onClick={() => setModalOpen(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center gap-3 p-6 mt-4 rounded-[24px] cursor-pointer
                         border-2 border-dashed border-rose-200 bg-rose-50 text-rose-500
                         hover:border-rose-300 hover:bg-rose-100/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Upload className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-rose-700 text-[15px]">Tải đơn thuốc lên</p>
                <p className="text-[13px] text-rose-500/80 mt-1">Bắt buộc cho thuốc kê đơn (Rx)</p>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* ── State 2: Prescription uploaded — inline preview ── */}
        {item.prescription && (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200
                       rounded-xl"
          >
            {/* Prescription thumbnail linked to this item */}
            <div className="shrink-0 relative">
              {isImage ? (
                <img
                  src={item.prescription.fileUrl}
                  alt="Đơn thuốc"
                  className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-300 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-emerald-100
                                rounded-lg border-2 border-emerald-300">
                  <FileText className="w-7 h-7 text-emerald-500" />
                </div>
              )}
              {/* Verified badge */}
              <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Đơn thuốc đã xác nhận
              </p>
              <p className="text-[13px] text-emerald-600/80 truncate max-w-[200px]">
                {item.prescription.fileName}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-[11px] text-emerald-500/70 font-medium">
                  {new Date(item.prescription.uploadedAt).toLocaleTimeString('vi-VN')}
                </p>
                <span className="w-1 h-1 rounded-full bg-emerald-200" />
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 uppercase tracking-wider transition-colors"
                >
                  Thay đổi
                </button>
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={removePrescription}
              className="shrink-0 p-1 rounded-full hover:bg-emerald-100 text-emerald-400
                         hover:text-emerald-600 transition-colors"
              title="Xóa đơn thuốc"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
