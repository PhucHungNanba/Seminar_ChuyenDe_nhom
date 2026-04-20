// Mock medicine data — replace with API call when backend is ready
export interface TabContent {
  ingredients: string
  indications: string
  dosage: string
  sideEffects: string
}

export interface Medicine {
  id: string
  name: string
  genericName: string
  manufacturer: string
  type: 'otc' | 'rx'
  price: number
  unit: string          // "hộp", "vỉ", "chai"
  imageUrl: string
  description: string
  tabs: TabContent
  rating: number        // 1-5
  reviewCount: number
  inStock: boolean
  tags: string[]
}

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'otc-001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'Dược Hậu Giang (DHG)',
    type: 'otc',
    price: 25000,
    unit: 'hộp 100 viên',
    imageUrl: 'https://placehold.co/480x480/e0f2fe/0ea5e9?text=Paracetamol',
    description: 'Thuốc hạ sốt, giảm đau nhức đầu, đau cơ, đau răng thông thường.',
    rating: 4.7,
    reviewCount: 1248,
    inStock: true,
    tags: ['Hạ sốt', 'Giảm đau', 'OTC'],
    tabs: {
      ingredients: `**Hoạt chất:** Paracetamol 500mg\n**Tá dược:** Tinh bột ngô, Povidon K30, Natri tinh bột glycolat, Magnesi stearat, Talc.`,
      indications: `- Giảm đau nhẹ đến vừa: đau đầu, đau răng, đau cơ, đau khớp\n- Hạ sốt do cảm cúm, cảm lạnh\n- Giảm đau sau khi tiêm chủng`,
      dosage: `**Người lớn & trẻ em ≥ 12 tuổi:**\n- 1–2 viên / lần, 3–4 lần / ngày\n- Cách nhau ít nhất 4–6 giờ\n- Tối đa 8 viên/ngày (4g/ngày)\n\n**Trẻ em 6–12 tuổi:**\n- ½–1 viên / lần, tối đa 4 lần/ngày`,
      sideEffects: `Thường gặp (>1%): Buồn nôn nhẹ, phát ban\n\nHiếm gặp (<0.1%): Tổn thương gan (quá liều), giảm tiểu cầu\n\n⚠️ Không dùng quá 4g/ngày. Không uống rượu khi dùng thuốc.`,
    },
  },
  {
    id: 'rx-001',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    manufacturer: 'Pymepharco',
    type: 'rx',
    price: 85000,
    unit: 'hộp 2 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/480x480/fef3c7/f59e0b?text=Amoxicillin',
    description: 'Kháng sinh nhóm Penicillin, điều trị nhiễm khuẩn đường hô hấp, tiết niệu, da.',
    rating: 4.5,
    reviewCount: 832,
    inStock: true,
    tags: ['Kháng sinh', 'Kê đơn', 'Rx'],
    tabs: {
      ingredients: `**Hoạt chất:** Amoxicillin trihydrat tương đương Amoxicillin 500mg\n**Tá dược:** Magnesi stearat, Talc, Tinh bột ngô biến tính, Povidon K30.`,
      indications: `- Viêm phổi, viêm phế quản cấp\n- Viêm amidan, viêm xoang do vi khuẩn\n- Nhiễm khuẩn đường tiết niệu\n- Nhiễm khuẩn da và mô mềm\n- Phòng ngừa viêm nội tâm mạc`,
      dosage: `**Người lớn:**\n- 500mg / lần, 3 lần / ngày (mỗi 8 giờ)\n- Hoặc 875mg / lần, 2 lần / ngày\n- Uống lúc no hoặc đói đều được\n\n⚠️ Phải hoàn thành đủ liệu trình theo chỉ định bác sĩ, không tự ý ngừng thuốc.`,
      sideEffects: `Thường gặp (>5%): Tiêu chảy, buồn nôn, phát ban\n\nÍt gặp (1–5%): Nôn, đau bụng, nổi mề đay\n\nHiếm gặp (<1%): Sốc phản vệ (ngừng thuốc ngay, liên hệ bác sĩ), viêm đại tràng giả mạc\n\n⚠️ Báo ngay cho bác sĩ nếu khó thở, phù mặt, hoặc phát ban nặng.`,
    },
  },
  {
    id: 'otc-002',
    name: 'Vitamin C 1000mg',
    genericName: 'Ascorbic Acid',
    manufacturer: 'Traphaco',
    type: 'otc',
    price: 45000,
    unit: 'hộp 30 viên sủi',
    imageUrl: 'https://placehold.co/480x480/d1fae5/10b981?text=Vitamin+C',
    description: 'Bổ sung vitamin C, tăng cường miễn dịch, chống oxy hóa.',
    rating: 4.8,
    reviewCount: 2103,
    inStock: true,
    tags: ['Vitamin', 'Miễn dịch', 'OTC'],
    tabs: {
      ingredients: `**Hoạt chất:** Ascorbic acid (Vitamin C) 1000mg\n**Tá dược:** Sorbitol, Natri bicarbonate, Acid citric khan, Polyethylene glycol, Hương cam.`,
      indications: `- Phòng và điều trị thiếu Vitamin C\n- Hỗ trợ tăng đề kháng, miễn dịch\n- Chống oxy hóa, hỗ trợ hấp thu sắt\n- Cải thiện làn da, giảm thâm nám`,
      dosage: `**Người lớn:** 1 viên sủi/ngày, hòa tan trong 200ml nước\n**Trẻ em 6–12 tuổi:** ½ viên/ngày\n\nUống sau bữa ăn để giảm kích ứng dạ dày.`,
      sideEffects: `Thường gặp (liều cao): Tiêu chảy, đau bụng, sỏi thận (>2g/ngày)\n\nHiếm gặp: Phản ứng dị ứng, buồn nôn\n\n✅ An toàn ở liều khuyến cáo. Không cần kê đơn bác sĩ.`,
    },
  },
  {
    id: 'rx-002',
    name: 'Metformin 850mg',
    genericName: 'Metformin Hydrochloride',
    manufacturer: 'Stada Việt Nam',
    type: 'rx',
    price: 120000,
    unit: 'hộp 3 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/480x480/fef3c7/f59e0b?text=Metformin',
    description: 'Điều trị đái tháo đường type 2, kiểm soát đường huyết.',
    rating: 4.6,
    reviewCount: 567,
    inStock: true,
    tags: ['Tiểu đường', 'Kê đơn', 'Rx'],
    tabs: {
      ingredients: `**Hoạt chất:** Metformin hydrochloride 850mg\n**Tá dược:** Povidon, Magnesi stearat, Hypromellose, Macrogol 400.`,
      indications: `- Điều trị đái tháo đường type 2 (đặc biệt người thừa cân)\n- Phối hợp với chế độ ăn kiêng và luyện tập\n- Có thể dùng đơn độc hoặc phối hợp với insulin/thuốc hạ đường huyết khác`,
      dosage: `**Liều khởi đầu:** 500mg hoặc 850mg × 1 lần/ngày trong bữa ăn\n\n**Liều duy trì:** Tăng dần theo chỉ dẫn bác sĩ, tối đa 2550mg/ngày\n\n⚠️ Phải theo dõi chức năng thận định kỳ. Ngừng 48h trước khi chụp cản quang.`,
      sideEffects: `Thường gặp (10–30%): Buồn nôn, tiêu chảy, đau bụng (thường giảm sau vài tuần)\n\nÍt gặp: Giảm hấp thu Vitamin B12 (dùng lâu dài)\n\nHiếm gặp nhưng nghiêm trọng: Nhiễm toan lactic (ngừng thuốc ngay)\n\n⚠️ Báo bác sĩ nếu có: khó thở, đau cơ bắt, cảm giác lạnh, chóng mặt.`,
    },
  },
]

// Helper to find medicine by id
export function getMedicineById(id: string): Medicine | undefined {
  return MOCK_MEDICINES.find((m) => m.id === id)
}
