// Full product catalog — source of truth for ProductsPage + MedicineDetailPage
// "form" = dạng bào chế: 'tablet' | 'liquid' | 'capsule' | 'device'

export type ProductForm = 'tablet' | 'liquid' | 'capsule' | 'device'

export interface TabContent {
  ingredients: string
  indications: string
  dosage: string
  sideEffects: string
}

// Default tab content dùng cho SP chưa có nội dung chi tiết
const DEFAULT_TABS: TabContent = {
  ingredients: 'Thông tin thành phần đang được cập nhật.',
  indications: 'Thông tin chỉ định đang được cập nhật.',
  dosage: 'Vui lòng tham khảo hướng dẫn sử dụng đi kèm sản phẩm hoặc hỏi dược sĩ.',
  sideEffects: 'Thông tin tác dụng phụ đang được cập nhật.',
}

export interface Product {
  id: string
  name: string
  genericName: string
  manufacturer: string
  type: 'otc' | 'rx'
  form: ProductForm
  price: number
  unit: string
  imageUrl: string
  description: string
  rating: number
  reviewCount: number
  inStock: boolean
  tags: string[]
  badge?: string
  tabs: TabContent
}

export const ALL_PRODUCTS: Product[] = [
  // ─── OTC — Tablet ──────────────────────────────────────────
  {
    id: 'otc-001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'Dược Hậu Giang',
    type: 'otc',
    form: 'tablet',
    price: 25000,
    unit: 'hộp 100 viên',
    imageUrl: 'https://placehold.co/320x320/e0f2fe/0ea5e9?text=Paracetamol',
    description: 'Hạ sốt, giảm đau nhức đầu, đau cơ thông thường.',
    rating: 4.7,
    reviewCount: 1248,
    inStock: true,
    tags: ['Hạ sốt', 'Giảm đau'],
    badge: 'Bán chạy',
    tabs: DEFAULT_TABS,
  },
  {
    id: 'otc-003',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Dihydrochloride',
    manufacturer: 'Sanofi Việt Nam',
    type: 'otc',
    form: 'tablet',
    price: 38000,
    unit: 'hộp 10 viên',
    imageUrl: 'https://placehold.co/320x320/ede9fe/7c3aed?text=Cetirizine',
    description: 'Kháng histamine, điều trị dị ứng, viêm mũi dị ứng, mề đay.',
    rating: 4.4,
    reviewCount: 945,
    inStock: true,
    tags: ['Dị ứng', 'Kháng histamine'],
    badge: 'Mới',
    tabs: DEFAULT_TABS,
  },
  {
    id: 'otc-005',
    name: 'Aspirin 81mg',
    genericName: 'Acetylsalicylic Acid',
    manufacturer: 'Bayer',
    type: 'otc',
    form: 'tablet',
    price: 55000,
    unit: 'hộp 30 viên',
    imageUrl: 'https://placehold.co/320x320/fef2f2/ef4444?text=Aspirin',
    description: 'Liều thấp phòng ngừa huyết khối, nhồi máu cơ tim.',
    rating: 4.6,
    reviewCount: 2140,
    inStock: true,
    tags: ['Tim mạch', 'Giảm đau'],
    tabs: DEFAULT_TABS,
  },
  {
    id: 'otc-006',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    manufacturer: 'Imexpharm',
    type: 'otc',
    form: 'tablet',
    price: 32000,
    unit: 'hộp 20 viên',
    imageUrl: 'https://placehold.co/320x320/f0f9ff/0284c7?text=Ibuprofen',
    description: 'Kháng viêm, giảm đau, hạ sốt nhanh chóng.',
    rating: 4.5,
    reviewCount: 873,
    inStock: true,
    tags: ['Kháng viêm', 'Giảm đau'],
    tabs: DEFAULT_TABS,
  },

  // ─── OTC — Capsule ─────────────────────────────────────────
  {
    id: 'otc-002',
    name: 'Vitamin C 1000mg',
    genericName: 'Ascorbic Acid',
    manufacturer: 'Traphaco',
    type: 'otc',
    form: 'capsule',
    price: 45000,
    unit: 'hộp 30 viên sủi',
    imageUrl: 'https://placehold.co/320x320/d1fae5/10b981?text=Vitamin+C',
    description: 'Bổ sung vitamin C, tăng cường miễn dịch, chống oxy hóa.',
    rating: 4.8,
    reviewCount: 2103,
    inStock: true,
    tags: ['Vitamin', 'Miễn dịch'],
    badge: 'Yêu thích',
    tabs: DEFAULT_TABS,
  },
  {
    id: 'otc-004',
    name: 'Omega-3 Fish Oil',
    genericName: 'EPA + DHA 1000mg',
    manufacturer: 'Nature Made',
    type: 'otc',
    form: 'capsule',
    price: 280000,
    unit: 'hộp 60 viên nang',
    imageUrl: 'https://placehold.co/320x320/fff7ed/f97316?text=Omega-3',
    description: 'Hỗ trợ tim mạch, não bộ, giảm triglyceride máu.',
    rating: 4.9,
    reviewCount: 3412,
    inStock: true,
    tags: ['Tim mạch', 'Não bộ'],
    badge: 'Bán chạy',
    tabs: DEFAULT_TABS,
  },
  {
    id: 'otc-007',
    name: 'Vitamin D3 2000IU',
    genericName: 'Cholecalciferol',
    manufacturer: 'Blackmores',
    type: 'otc',
    form: 'capsule',
    price: 195000,
    unit: 'hộp 60 viên',
    imageUrl: 'https://placehold.co/320x320/fefce8/ca8a04?text=Vit+D3',
    description: 'Bổ sung vitamin D3, hỗ trợ hấp thu canxi, tăng cường xương khớp.',
    rating: 4.7,
    reviewCount: 1876,
    inStock: true,
    tags: ['Vitamin', 'Xương khớp'],
    tabs: DEFAULT_TABS,
  },

  // ─── OTC — Liquid ──────────────────────────────────────────
  {
    id: 'otc-008',
    name: 'Siro ho trẻ em Prospan',
    genericName: 'Ivy Leaf Extract',
    manufacturer: 'Engelhard Arzneimittel',
    type: 'otc',
    form: 'liquid',
    price: 95000,
    unit: 'chai 100ml',
    imageUrl: 'https://placehold.co/320x320/ecfdf5/065f46?text=Prospan',
    description: 'Giảm ho, long đờm cho trẻ em từ 1 tuổi trở lên.',
    rating: 4.6,
    reviewCount: 1654,
    inStock: true,
    tags: ['Hô hấp', 'Trẻ em'],
    badge: 'Bán chạy',
    tabs: DEFAULT_TABS,
  },
  {
    id: 'otc-009',
    name: 'Dung dịch vệ sinh mũi NaCl 0.9%',
    genericName: 'Sodium Chloride 0.9%',
    manufacturer: 'DHG Pharma',
    type: 'otc',
    form: 'liquid',
    price: 28000,
    unit: 'chai 250ml',
    imageUrl: 'https://placehold.co/320x320/f0f9ff/0284c7?text=NaCl',
    description: 'Rửa mũi, vệ sinh tai mũi họng, an toàn cho mọi lứa tuổi.',
    rating: 4.5,
    reviewCount: 3200,
    inStock: true,
    tags: ['Tai mũi họng', 'Vệ sinh'],
    tabs: DEFAULT_TABS,
  },

  // ─── Rx — Tablet ───────────────────────────────────────────
  {
    id: 'rx-001',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    manufacturer: 'Pymepharco',
    type: 'rx',
    form: 'tablet',
    price: 85000,
    unit: 'hộp 2 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/320x320/fef3c7/f59e0b?text=Amoxicillin',
    description: 'Kháng sinh nhóm Penicillin điều trị nhiễm khuẩn đường hô hấp, tiết niệu.',
    rating: 4.5,
    reviewCount: 832,
    inStock: true,
    tags: ['Kháng sinh', 'Kê đơn'],
    tabs: DEFAULT_TABS,
  },
  {
    id: 'rx-002',
    name: 'Metformin 850mg',
    genericName: 'Metformin HCl',
    manufacturer: 'Stada Việt Nam',
    type: 'rx',
    form: 'tablet',
    price: 120000,
    unit: 'hộp 3 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/320x320/fef3c7/f59e0b?text=Metformin',
    description: 'Điều trị đái tháo đường type 2, kiểm soát đường huyết.',
    rating: 4.6,
    reviewCount: 567,
    inStock: true,
    tags: ['Tiểu đường', 'Kê đơn'],
    tabs: DEFAULT_TABS,
  },
  {
    id: 'rx-003',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate',
    manufacturer: 'Pfizer',
    type: 'rx',
    form: 'tablet',
    price: 145000,
    unit: 'hộp 3 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/320x320/fdf4ff/a855f7?text=Amlodipine',
    description: 'Thuốc hạ áp nhóm chẹn kênh calci, điều trị tăng huyết áp và đau thắt ngực.',
    rating: 4.7,
    reviewCount: 412,
    inStock: true,
    tags: ['Tim mạch', 'Hạ áp'],
    tabs: DEFAULT_TABS,
  },
  {
    id: 'rx-004',
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    manufacturer: 'Teva Pharmaceuticals',
    type: 'rx',
    form: 'tablet',
    price: 235000,
    unit: 'hộp 3 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/320x320/fef9c3/a16207?text=Atorva',
    description: 'Statin hạ cholesterol, phòng ngừa bệnh tim mạch xơ vữa.',
    rating: 4.8,
    reviewCount: 289,
    inStock: true,
    tags: ['Cholesterol', 'Tim mạch'],
    tabs: DEFAULT_TABS,
  },

  // ─── Rx — Liquid ───────────────────────────────────────────
  {
    id: 'rx-005',
    name: 'Augmentin 457mg/5ml',
    genericName: 'Amoxicillin + Clavulanic Acid',
    manufacturer: 'GlaxoSmithKline',
    type: 'rx',
    form: 'liquid',
    price: 185000,
    unit: 'chai 70ml',
    imageUrl: 'https://placehold.co/320x320/fef3c7/d97706?text=Augmentin',
    description: 'Kháng sinh phổ rộng dạng hỗn dịch cho trẻ em, điều trị nhiễm khuẩn kháng Penicillin.',
    rating: 4.5,
    reviewCount: 381,
    inStock: true,
    tags: ['Kháng sinh', 'Trẻ em'],
    tabs: DEFAULT_TABS,
  },

  // ─── Devices ───────────────────────────────────────────────
  {
    id: 'med-001',
    name: 'Nhiệt kế điện tử',
    genericName: 'Digital Thermometer',
    manufacturer: 'Omron',
    type: 'otc',
    form: 'device',
    price: 185000,
    unit: 'cái',
    imageUrl: 'https://placehold.co/320x320/f0fdf4/16a34a?text=Nhiệt+kế',
    description: 'Đo nhiệt độ cơ thể chính xác trong 60 giây, màn hình LCD.',
    rating: 4.7,
    reviewCount: 728,
    inStock: true,
    tags: ['Vật tư y tế', 'Đo lường'],
    tabs: DEFAULT_TABS,
  },
  {
    id: 'med-002',
    name: 'Máy đo huyết áp bắp tay',
    genericName: 'Blood Pressure Monitor',
    manufacturer: 'Omron HEM-7156',
    type: 'otc',
    form: 'device',
    price: 1250000,
    unit: 'máy',
    imageUrl: 'https://placehold.co/320x320/fdf2f8/ec4899?text=Huyết+áp',
    description: 'Máy đo huyết áp bắp tay tự động, cảnh báo rối loạn nhịp tim (AFib).',
    rating: 4.8,
    reviewCount: 1563,
    inStock: true,
    tags: ['Vật tư y tế', 'Tim mạch'],
    badge: 'Sale',
    tabs: DEFAULT_TABS,
  },
  {
    id: 'med-003',
    name: 'Máy đo đường huyết Accu-Chek',
    genericName: 'Glucometer',
    manufacturer: 'Roche',
    type: 'otc',
    form: 'device',
    price: 650000,
    unit: 'máy + 10 que thử',
    imageUrl: 'https://placehold.co/320x320/f0f9ff/0369a1?text=Accu-Chek',
    description: 'Đo đường huyết mao mạch nhanh chóng, kết quả trong 4 giây.',
    rating: 4.9,
    reviewCount: 2341,
    inStock: true,
    tags: ['Tiểu đường', 'Đo lường'],
    badge: 'Bán chạy',
    tabs: DEFAULT_TABS,
  },
]

// ─── Tab content cho từng sản phẩm có nội dung chi tiết ─────────────────────
// Các SP còn lại dùng DEFAULT_TABS tự động qua getMedicineById()
const TABS_MAP: Record<string, TabContent> = {
  'otc-001': {
    ingredients: `**Hoạt chất:** Paracetamol 500mg\n**Tá dược:** Tinh bột ngô, Povidon K30, Natri tinh bột glycolat, Magnesi stearat, Talc.`,
    indications: `- Giảm đau nhẹ đến vừa: đau đầu, đau răng, đau cơ, đau khớp\n- Hạ sốt do cảm cúm, cảm lạnh\n- Giảm đau sau khi tiêm chủng`,
    dosage: `**Người lớn & trẻ em ≥ 12 tuổi:**\n- 1–2 viên / lần, 3–4 lần / ngày\n- Cách nhau ít nhất 4–6 giờ\n- Tối đa 8 viên/ngày (4g/ngày)\n\n**Trẻ em 6–12 tuổi:**\n- ½–1 viên / lần, tối đa 4 lần/ngày`,
    sideEffects: `Thường gặp (>1%): Buồn nôn nhẹ, phát ban\n\nHiếm gặp (<0.1%): Tổn thương gan (quá liều), giảm tiểu cầu\n\n⚠️ Không dùng quá 4g/ngày. Không uống rượu khi dùng thuốc.`,
  },
  'rx-001': {
    ingredients: `**Hoạt chất:** Amoxicillin trihydrat tương đương Amoxicillin 500mg\n**Tá dược:** Magnesi stearat, Talc, Tinh bột ngô biến tính, Povidon K30.`,
    indications: `- Viêm phổi, viêm phế quản cấp\n- Viêm amidan, viêm xoang do vi khuẩn\n- Nhiễm khuẩn đường tiết niệu\n- Nhiễm khuẩn da và mô mềm`,
    dosage: `**Người lớn:**\n- 500mg / lần, 3 lần / ngày (mỗi 8 giờ)\n- Hoặc 875mg / lần, 2 lần / ngày\n\n⚠️ Phải hoàn thành đủ liệu trình, không tự ý ngừng thuốc.`,
    sideEffects: `Thường gặp (>5%): Tiêu chảy, buồn nôn, phát ban\n\nÍt gặp: Nôn, đau bụng\n\nHiếm gặp (<1%): Sốc phản vệ — ngừng thuốc ngay, liên hệ bác sĩ\n\n⚠️ Báo ngay nếu khó thở, phù mặt, hoặc phát ban nặng.`,
  },
  'otc-002': {
    ingredients: `**Hoạt chất:** Ascorbic acid (Vitamin C) 1000mg\n**Tá dược:** Sorbitol, Natri bicarbonate, Acid citric khan, Polyethylene glycol, Hương cam.`,
    indications: `- Phòng và điều trị thiếu Vitamin C\n- Hỗ trợ tăng đề kháng, miễn dịch\n- Chống oxy hóa, hỗ trợ hấp thu sắt`,
    dosage: `**Người lớn:** 1 viên sủi/ngày, hòa tan trong 200ml nước\n**Trẻ em 6–12 tuổi:** ½ viên/ngày\n\nUống sau bữa ăn để giảm kích ứng dạ dày.`,
    sideEffects: `Thường gặp (liều cao): Tiêu chảy, đau bụng, sỏi thận (>2g/ngày)\n\nHiếm gặp: Phản ứng dị ứng\n\n✅ An toàn ở liều khuyến cáo.`,
  },
  'rx-002': {
    ingredients: `**Hoạt chất:** Metformin hydrochloride 850mg\n**Tá dược:** Povidon, Magnesi stearat, Hypromellose, Macrogol 400.`,
    indications: `- Điều trị đái tháo đường type 2 (đặc biệt người thừa cân)\n- Phối hợp với chế độ ăn kiêng và luyện tập`,
    dosage: `**Liều khởi đầu:** 500mg hoặc 850mg × 1 lần/ngày trong bữa ăn\n\n**Liều duy trì:** Tăng dần theo chỉ dẫn bác sĩ, tối đa 2550mg/ngày\n\n⚠️ Theo dõi chức năng thận định kỳ.`,
    sideEffects: `Thường gặp (10–30%): Buồn nôn, tiêu chảy, đau bụng\n\nÍt gặp: Giảm hấp thu Vitamin B12\n\nHiếm gặp nhưng nghiêm trọng: Nhiễm toan lactic — ngừng thuốc ngay`,
  },
}

// Helper — dùng ở MedicineDetailPage thay cho getMedicineById() cũ
export function getMedicineById(id: string): Product | undefined {
  const product = ALL_PRODUCTS.find((p) => p.id === id)
  if (!product) return undefined
  // Inject tab content thật nếu có, nếu không dùng DEFAULT_TABS
  return { ...product, tabs: TABS_MAP[id] ?? DEFAULT_TABS }
}

