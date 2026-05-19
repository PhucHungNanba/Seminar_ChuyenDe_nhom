import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle2, Phone, Activity, AlertCircle, Stethoscope, Building2, HeartPulse, Calendar } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import axiosClient from '../../api/axiosClient'

interface Props {
  open: boolean
  onClose: () => void
}

export default function QuickPrescriptionModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  
  const [step, setStep] = useState<1 | 2>(1)
  const [file, setFile] = useState<File | null>(null)
  const [phone, setPhone] = useState('')
  const [symptoms, setSymptoms] = useState('')
  
  // New optional prescription fields
  const [doctorName, setDoctorName] = useState('')
  const [hospital, setHospital] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [issueDate, setIssueDate] = useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone) return

    const normalizedPhone = phone.trim().replace(/\s+/g, '')
    const validPhone = /^(0|\+84)\d{9,10}$/.test(normalizedPhone)
    if (!validPhone) {
      setError('Vui lòng nhập số điện thoại hợp lệ.')
      return
    }

    if (!user) {
      setError('Bạn cần đăng nhập để gửi yêu cầu kê đơn.')
      return
    }

    if (!file) {
      setError('Vui lòng tải ảnh đơn thuốc lên.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('customerPhone', normalizedPhone)
      if (symptoms.trim()) {
        formData.append('pharmacistNote', symptoms.trim())
      }
      formData.append('image', file)

      // Append new optional fields
      if (doctorName.trim()) {
        formData.append('doctorName', doctorName.trim())
      }
      if (hospital.trim()) {
        formData.append('hospital', hospital.trim())
      }
      if (diagnosis.trim()) {
        formData.append('diagnosis', diagnosis.trim())
      }
      if (issueDate) {
        formData.append('issueDate', issueDate)
      }

      await axiosClient.post('/orders/prescriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setStep(2)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gửi toa thuốc thất bại'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle close to reset state
  function handleClose() {
    onClose()
    setTimeout(() => {
      setStep(1)
      setFile(null)
      setPhone('')
      setSymptoms('')
      setDoctorName('')
      setHospital('')
      setDiagnosis('')
      setIssueDate('')
      setError('')
      setSubmitting(false)
    }, 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-blue-50 shrink-0">
              <h2 className="text-lg font-bold text-blue-800">
                Gửi Toa Thuốc - Tư Vấn Tận Tình
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-blue-100 text-blue-800 transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
                {/* Drag Drop */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-blue-50/50 hover:bg-blue-50 transition-colors shrink-0"
                >
                  <Upload className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="font-semibold text-blue-800 mb-1">Kéo thả đơn thuốc vào đây</p>
                  <p className="text-xs text-blue-600/80 mb-4">hoặc nhấn để tải ảnh lên</p>
                  <label className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    Chọn Ảnh
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setFile(e.target.files[0])
                      }}
                      accept="image/*"
                      disabled={submitting}
                    />
                  </label>
                  {file && (
                    <p className="mt-3 text-sm text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> {file.name}
                    </p>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại của bạn"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none animate-none"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Triệu chứng / Ghi chú thêm
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Ví dụ: Đau đầu, sốt nhẹ..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-20"
                      disabled={submitting}
                    />
                  </div>

                  {/* Optional Doctor/Hospital/Diagnosis fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        Tên Bác sĩ
                      </label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="Bác sĩ kê đơn"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Tên Bệnh viện
                      </label>
                      <input
                        type="text"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        placeholder="Bệnh viện / Phòng khám"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <HeartPulse className="w-4 h-4 text-blue-600" />
                        Chẩn đoán bệnh
                      </label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Ví dụ: Viêm họng..."
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Ngày cấp đơn
                      </label>
                      <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-rose-600 font-medium flex items-center gap-1 shrink-0">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 mt-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Gửi Thông Tin'
                  )}
                </button>
              </form>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gửi toa thuốc thành công!</h3>
                <p className="text-gray-500 mb-6">
                  Dược sĩ PharmaCare sẽ gọi lại cho bạn theo số <span className="font-semibold text-gray-700">{phone}</span> trong vòng 5 phút để tư vấn và báo giá.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors"
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
