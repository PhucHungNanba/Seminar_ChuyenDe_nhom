import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ShoppingCart, Package,
  AlertTriangle, CheckCircle2, Minus, Plus, AlertCircle, MapPin, Search, ChevronRight
} from 'lucide-react'
import axiosClient from '../../api/axiosClient'
import { Product, AssociationRule } from '../../types'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import TypeBadge from '../../components/common/TypeBadge'
import FrequentlyBoughtTogether from '../../components/common/FrequentlyBoughtTogether'
import PrescriptionUploader from '../../components/cart/PrescriptionUploader'
import { formatDisplayId } from '../../utils/formatHelpers'

const MOCK_PHARMACIES = [
  { id: 1, name: 'Nhà thuốc PharmaCare Quận 5', address: '123 An Dương Vương, P.8, Quận 5', distance: '1.2 km' },
  { id: 2, name: 'Nhà thuốc PharmaCare Quận 10', address: '456 Sư Vạn Hạnh, P.12, Quận 10', distance: '3.5 km' },
  { id: 3, name: 'Nhà thuốc PharmaCare Quận 1', address: '789 Trần Hưng Đạo, P.Cầu Kho, Quận 1', distance: '4.1 km' },
]

const TABS = [
  { key: 'ingredients', label: 'Thành phần' },
  { key: 'indications', label: 'Chỉ định' },
  { key: 'dosage',      label: 'Liều lượng' },
  { key: 'sideEffects', label: 'Tác dụng phụ' },
] as const

type TabKey = typeof TABS[number]['key']

function SimpleText({ text }: { text: string }) {
  if (!text) return <p className="text-sm text-slate-500 italic">Đang cập nhật...</p>
  return (
    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-1">
      {text.split('\n').map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: bold }}
            className={line.startsWith('-') ? 'pl-4' : ''}
          />
        )
      })}
    </div>
  )
}



export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>()
  const addItem = useCartStore((s) => s.addItem)
  const { user } = useAuthStore()

  const [medicine, setMedicine] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [rules, setRules] = useState<AssociationRule[]>([])
  const [rulesLoading, setRulesLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<TabKey>('ingredients')
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [rxContactPhone, setRxContactPhone] = useState(user?.fullName ? '' : '')
  const [rxSymptomsNote, setRxSymptomsNote] = useState('')
  const [rxDoctorName, setRxDoctorName] = useState('')
  const [rxHospital, setRxHospital] = useState('')
  const [rxDiagnosis, setRxDiagnosis] = useState('')
  const [rxIssueDate, setRxIssueDate] = useState('')
  const [rxRequestError, setRxRequestError] = useState('')

  const [showInventory, setShowInventory] = useState(false)
  const [locationLoaded, setLocationLoaded] = useState(false)

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await axiosClient.get(`/products/${id}`)
        setMedicine(response.data?.data || response.data)
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thuốc:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMedicine()
  }, [id])

  useEffect(() => {
    const fetchRules = async () => {
      if (!id) return
      setRulesLoading(true)
      try {
        const response = await axiosClient.get(`/association-rules/recommend?productId=${id}`)
        const data = response.data || response || []
        setRules(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý:", error)
        setRules([])
      } finally {
        setRulesLoading(false)
      }
    }
    fetchRules()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-600">Không tìm thấy thuốc</h2>
        <Link to="/products" className="text-sky-500 hover:underline text-sm">
          ← Quay lại danh mục
        </Link>
      </div>
    )
  }

  const imgUrl = (medicine.images && medicine.images.length > 0) ? medicine.images[0] : 'https://placehold.co/320x320/e2e8f0/64748b?text=No+Image'
  const inStock = medicine.stock_quantity ? medicine.stock_quantity > 0 : true

  function handleAddToCart() {
    addItem({
      id: medicine!._id,
      name: medicine!.name,
      type: medicine!.type,
      price: medicine!.price,
      quantity: qty,
      imageUrl: imgUrl,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-sky-500 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-sky-500 transition-colors">Danh mục</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-[200px]">{medicine.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-5 flex flex-col gap-4"
        >
          <div className="bg-[#f5f5f7] rounded-[32px] overflow-hidden flex items-center justify-center p-12 aspect-square">
            <img
              src={imgUrl}
              alt={medicine.name}
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
            />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`w-20 h-20 rounded-[20px] bg-[#f5f5f7] overflow-hidden cursor-pointer transition-all
                            ${n === 1 ? 'ring-2 ring-black' : 'hover:bg-[#e8e8ed]'}`}
              >
                <img
                  src={imgUrl}
                  alt=""
                  className="w-full h-full object-contain mix-blend-multiply opacity-80"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-7 flex flex-col gap-6 pt-4"
        >
          <div className="flex flex-wrap gap-2">
            {(medicine.tags || []).map((tag) => (
              <span key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] uppercase tracking-wider font-semibold">
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              {medicine.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Hoạt chất: <span className="font-medium text-slate-600">{medicine.genericName}</span>
              {' · '}
              <span>{medicine.manufacturer}</span>
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Mã sản phẩm: {medicine.productCode || formatDisplayId(medicine._id, 'MED')}
            </p>
          </div>

          <TypeBadge type={medicine.type} size="md" />

          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-sky-600">
              {medicine.price?.toLocaleString('vi-VN')}đ
            </p>
            <p className="text-sm text-slate-400 mb-1">/ {medicine.unit}</p>
          </div>

          {medicine.type === 'rx' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex gap-4 p-5 bg-rose-50 rounded-[24px]"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-rose-600 mb-1">
                  Thuốc kê đơn (Rx)
                </p>
                <p className="text-[13px] text-rose-500/80 leading-relaxed pr-4">
                  Bạn cần tải lên đơn thuốc hợp lệ có chữ ký bác sĩ. Nếu không có đơn thuốc, quá trình thanh toán sẽ không thể thực hiện.
                </p>
              </div>
            </motion.div>
          ) : null}

          <div className="flex items-center gap-2 text-sm">
            {inStock ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 font-medium">Còn hàng · Giao trong 2 giờ</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-500 font-medium">Tạm hết hàng</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2">
            {medicine.type === 'rx' ? (
              <div className="w-full flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-1">
                    <label htmlFor="rx-contact-phone" className="text-sm font-semibold text-slate-700">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      id="rx-contact-phone"
                      type="tel"
                      value={rxContactPhone}
                      onChange={(e) => {
                        setRxContactPhone(e.target.value)
                        if (rxRequestError) setRxRequestError('')
                      }}
                      placeholder="VD: 0912345678"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="rx-symptoms-note" className="text-sm font-semibold text-slate-700">
                      Triệu chứng/ghi chú thêm
                    </label>
                    <textarea
                      id="rx-symptoms-note"
                      value={rxSymptomsNote}
                      onChange={(e) => setRxSymptomsNote(e.target.value)}
                      placeholder="Mô tả triệu chứng, dị ứng thuốc, lưu ý cho dược sĩ..."
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm resize-none
                                 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="md:col-span-1">
                    <label htmlFor="rx-doctor-name" className="text-sm font-semibold text-slate-700">
                      Tên Bác sĩ (Tùy chọn)
                    </label>
                    <input
                      id="rx-doctor-name"
                      type="text"
                      value={rxDoctorName}
                      onChange={(e) => setRxDoctorName(e.target.value)}
                      placeholder="Bác sĩ kê đơn"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="rx-hospital" className="text-sm font-semibold text-slate-700">
                      Tên Bệnh viện (Tùy chọn)
                    </label>
                    <input
                      id="rx-hospital"
                      type="text"
                      value={rxHospital}
                      onChange={(e) => setRxHospital(e.target.value)}
                      placeholder="Bệnh viện / Phòng khám"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                    />
                  </div>

                  {/* Diagnosis & Issue Date */}
                  <div className="md:col-span-1">
                    <label htmlFor="rx-diagnosis" className="text-sm font-semibold text-slate-700">
                      Chẩn đoán bệnh (Tùy chọn)
                    </label>
                    <input
                      id="rx-diagnosis"
                      type="text"
                      value={rxDiagnosis}
                      onChange={(e) => setRxDiagnosis(e.target.value)}
                      placeholder="VD: Viêm họng cấp..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="rx-issue-date" className="text-sm font-semibold text-slate-700">
                      Ngày cấp đơn (Tùy chọn)
                    </label>
                    <input
                      id="rx-issue-date"
                      type="date"
                      value={rxIssueDate}
                      onChange={(e) => setRxIssueDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                    />
                  </div>
                </div>

                {rxRequestError ? (
                  <p className="text-sm text-rose-600 font-medium">{rxRequestError}</p>
                ) : null}

                <PrescriptionUploader
                  mode="request"
                  productName={medicine.name}
                  onSubmit={async (payload) => {
                    const normalizedPhone = rxContactPhone.trim().replace(/\s+/g, '')
                    const validPhone = /^(0|\+84)\d{9,10}$/.test(normalizedPhone)
                    if (!validPhone) {
                      setRxRequestError('Vui lòng nhập số điện thoại hợp lệ trước khi gửi yêu cầu.')
                      return false
                    }
                    if (!user) {
                      setRxRequestError('Bạn cần đăng nhập để gửi yêu cầu kê đơn.')
                      return false
                    }
                    setRxRequestError('')
                    try {
                      const formData = new FormData()
                      formData.append('customerPhone', normalizedPhone)
                      if (rxSymptomsNote) {
                        formData.append('pharmacistNote', rxSymptomsNote)
                      }
                      if (payload.file) {
                        formData.append('image', payload.file)
                      } else {
                        formData.append('thumbnailUrl', payload.fileUrl)
                      }

                      // Append new optional fields
                      if (rxDoctorName.trim()) {
                        formData.append('doctorName', rxDoctorName.trim())
                      }
                      if (rxHospital.trim()) {
                        formData.append('hospital', rxHospital.trim())
                      }
                      if (rxDiagnosis.trim()) {
                        formData.append('diagnosis', rxDiagnosis.trim())
                      }
                      if (rxIssueDate) {
                        formData.append('issueDate', rxIssueDate)
                      }

                      // Link current product information to prescription request
                      const reqMedicines = [
                        {
                          productId: medicine._id,
                          name: medicine.name,
                          quantity: qty,
                          price: medicine.price,
                        },
                      ]
                      formData.append('medicines', JSON.stringify(reqMedicines))

                      await axiosClient.post('/orders/prescriptions', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      })
                      return true
                    } catch (err: any) {
                      const msg = err?.response?.data?.message || err?.message || 'Gửi yêu cầu thất bại'
                      setRxRequestError(msg)
                      return false
                    }
                  }}
                  buttonLabel="Gửi yêu cầu kê đơn"
                  disabled={!inStock}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200
                                rounded-full px-2 py-1.5">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full
                               hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-bold text-slate-700 w-7 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full
                               hover:bg-sky-100 text-sky-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <motion.button
                  id="btn-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  whileTap={{ scale: 0.96 }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-8
                              rounded-full font-bold text-[15px] transition-all
                              ${addedToCart
                                ? 'bg-emerald-500 text-white'
                                : inStock
                                  ? 'bg-black text-white hover:bg-slate-800'
                                  : 'bg-[#f5f5f7] text-slate-400 cursor-not-allowed'
                              }`}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Đã thêm vào giỏ!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ hàng
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </>
            )}
          </div>

          <div className="mt-4 border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => {
                setShowInventory(!showInventory)
                if (!locationLoaded) {
                  setTimeout(() => setLocationLoaded(true), 800)
                }
              }}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">Kiểm tra tồn kho tại nhà thuốc</p>
                  <p className="text-xs text-gray-500">Sản phẩm đang còn tại {MOCK_PHARMACIES.length} nhà thuốc ở TP.HCM</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showInventory ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showInventory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 overflow-hidden"
                >
                  {!locationLoaded ? (
                     <div className="p-6 flex flex-col items-center justify-center text-center">
                      <Search className="w-6 h-6 text-gray-400 animate-pulse mb-2" />
                      <p className="text-sm text-gray-500">Đang lấy vị trí của bạn...</p>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-600">Có thể giao trong 2 giờ từ nhà thuốc gần nhất</span>
                      </div>
                      {MOCK_PHARMACIES.map((pharmacy, idx) => (
                        <div key={pharmacy.id} className={`p-3 rounded-lg border ${idx === 0 ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 bg-gray-50'}`}>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-bold text-gray-800">{pharmacy.name}</p>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{pharmacy.distance}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{pharmacy.address}</p>
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> Còn hàng
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { label: 'Đóng gói', value: medicine.unit },
              { label: 'Nhà sản xuất', value: medicine.manufacturer },
              { label: 'Loại thuốc', value: medicine.type === 'otc' ? 'Không kê đơn' : 'Kê đơn (Rx)' },
              { label: 'Tình trạng', value: inStock ? 'Còn hàng' : 'Hết hàng' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap
                          transition-colors shrink-0
                          ${activeTab === tab.key
                            ? 'text-sky-600'
                            : 'text-slate-500 hover:text-slate-700'
                          }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <SimpleText text={medicine.tabs?.[activeTab] || ''} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-400
                     hover:text-sky-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách thuốc
        </Link>
      </div>

      <FrequentlyBoughtTogether
        associationRulesData={rules}
        currentProductIds={[medicine._id]}
        title="Thường được mua cùng nhau"
        maxItems={8}
        isLoading={rulesLoading}
      />
    </div>
  )
}
