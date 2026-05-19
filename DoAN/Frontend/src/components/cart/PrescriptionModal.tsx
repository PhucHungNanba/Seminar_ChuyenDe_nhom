import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Upload, FileText, CheckCircle2, ImageIcon, AlertTriangle
} from 'lucide-react'
import { useCartStore, CartItem } from '../../store/cartStore'

interface Props {
  item?: CartItem
  productName?: string
  mode?: 'cart' | 'request'
  onConfirm?: (payload: { fileUrl: string; fileName: string; uploadedAt: string; file?: File }) => void | Promise<boolean | void> | boolean
  open: boolean
  onClose: () => void
}

// ── Slide-up modal via React Portal ─────────────────
export default function PrescriptionModal({ item, productName, mode = 'cart', onConfirm, open, onClose }: Props) {
  const setPrescription = useCartStore((s) => s.setPrescription)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const displayName = item?.name || productName || 'đơn thuốc'

  function processFile(file: File) {
    const localUrl = URL.createObjectURL(file)
    setPreview({ url: localUrl, name: file.name })
    setSelectedFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleConfirm() {
    if (!preview) return
    setUploading(true)
    // Simulate 1s upload then commit to store
    setTimeout(async () => {
      const payload = {
        fileUrl: preview.url,
        fileName: preview.name,
        uploadedAt: new Date().toISOString(),
        file: selectedFile || undefined,
      }
      if (mode === 'request') {
        const accepted = await onConfirm?.(payload)
        if (accepted === false) {
          setUploading(false)
          return
        }
      } else if (item) {
        setPrescription(item.id, payload)
      }
      setUploading(false)
      setPreview(null)
      setSelectedFile(null)
      onClose()
    }, 1000)
  }

  function handleClose() {
    if (uploading) return
    setPreview(null)
    setSelectedFile(null)
    onClose()
  }

  const isImage = preview?.name
    ? /\.(jpg|jpeg|png|gif|webp)$/i.test(preview.name)
    : false

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* ── Slide-up panel ── */}
          <motion.div
            key="panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl
                       shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="px-5 pb-8 pt-2">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Tải đơn thuốc lên
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Dành cho: <span className="font-semibold text-amber-700">{displayName}</span>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400
                             hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Drop zone ── */}
              <AnimatePresence mode="wait">
                {!preview ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                               transition-all duration-200 select-none
                               ${dragOver
                                 ? 'border-sky-400 bg-sky-50 scale-[1.01]'
                                 : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                               }`}
                  >
                    <input
                      ref={fileRef}
                      id={`modal-upload-${item?.id || 'rx-request'}`}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <motion.div
                      animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="flex justify-center mb-3"
                    >
                      <div className="p-4 rounded-full bg-sky-100">
                        <Upload className="w-8 h-8 text-sky-500" />
                      </div>
                    </motion.div>
                    <p className="font-semibold text-slate-700">
                      Kéo & thả hoặc nhấn để chọn file
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Hỗ trợ: JPG, PNG, PDF — Tối đa 10MB
                    </p>
                  </motion.div>
                ) : (
                  /* ── File preview ── */
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden
                                      border-2 border-emerald-300 shadow-sm">
                        {isImage ? (
                          <img
                            src={preview.url}
                            alt="Preview đơn thuốc"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center
                                          bg-emerald-100">
                            <FileText className="w-8 h-8 text-emerald-500" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isImage
                            ? <ImageIcon className="w-4 h-4 text-emerald-500" />
                            : <FileText className="w-4 h-4 text-emerald-500" />
                          }
                          <span className="text-xs font-semibold text-emerald-700">
                            {isImage ? 'Hình ảnh' : 'PDF'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {preview.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Sẵn sàng để xác nhận
                        </p>
                      </div>

                      {/* Re-pick */}
                      <button
                        onClick={() => { setPreview(null); fileRef.current?.click() }}
                        className="shrink-0 p-1.5 rounded-full hover:bg-emerald-100
                                   text-emerald-500 transition-colors"
                        title="Chọn file khác"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Notice ── */}
              <p className="text-xs text-slate-400 text-center mt-4">
                Đơn thuốc sẽ được liên kết riêng với sản phẩm <strong>{displayName}</strong>.
                Chúng tôi bảo mật thông tin y tế của bạn.
              </p>

              {/* ── Action buttons ── */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600
                             font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  Huỷ
                </button>

                <motion.button
                  id={`confirm-upload-${item?.id || 'rx-request'}`}
                  onClick={handleConfirm}
                  disabled={!preview || uploading}
                  whileTap={preview && !uploading ? { scale: 0.97 } : {}}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center
                             justify-center gap-2 transition-all
                             ${preview && !uploading
                               ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md hover:shadow-sky-200'
                               : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                             }`}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white
                                      rounded-full animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Xác nhận
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
