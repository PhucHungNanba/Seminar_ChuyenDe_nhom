/**
 * Mock Prescription Vault — Sổ lưu đơn thuốc
 *
 * Mỗi `SavedPrescription` đại diện cho một đơn thuốc đã được
 * dược sĩ xác nhận và lưu vào hồ sơ bệnh nhân.
 *
 * Khi Backend sẵn sàng, thay thế bằng:
 *   GET /api/users/me/prescriptions → SavedPrescription[]
 */

export type PrescriptionStatus = 'valid' | 'expired'

export interface PrescriptionMedicine {
  productId: string   // khớp với id trong allProducts.ts
  name: string
  genericName: string
  dosage: string      // VD: "500mg × 2 lần/ngày"
  quantity: number    // số lượng hộp/gói
  price: number
  imageUrl: string
}

export interface SavedPrescription {
  id: string
  prescriptionCode: string         // Mã đơn thuốc (từ BV / phòng khám)
  issuedDate: string               // ISO date string
  expiryDate: string               // ISO date string — hết hạn sau 6 tháng theo quy định
  status: PrescriptionStatus
  doctorName: string
  doctorSpecialty: string          // Chuyên khoa
  hospital: string                 // Bệnh viện / Phòng khám
  diagnosis: string                // Chẩn đoán (ICD-10 friendly)
  thumbnailUrl: string             // Ảnh chụp đơn thuốc (đã upload)
  medicines: PrescriptionMedicine[]
  notes?: string                   // Ghi chú của bác sĩ
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_PRESCRIPTIONS: SavedPrescription[] = [
  {
    id: 'prx-001',
    prescriptionCode: 'BV-BACH-MAI-2024-08-1234',
    issuedDate: '2024-08-15',
    expiryDate: '2025-02-15',
    status: 'valid',
    doctorName: 'BS. Nguyễn Văn Minh',
    doctorSpecialty: 'Nội tiết – Đái tháo đường',
    hospital: 'BV Bạch Mai',
    diagnosis: 'Đái tháo đường type 2 (E11) — kiểm soát đường huyết',
    thumbnailUrl: 'https://placehold.co/400x560/f0fdf4/16a34a?text=Đơn+thuốc+%231',
    notes: 'Tái khám sau 3 tháng. Theo dõi đường huyết lúc đói mỗi sáng.',
    medicines: [
      {
        productId: 'rx-002',
        name: 'Metformin 850mg',
        genericName: 'Metformin HCl',
        dosage: '850mg × 2 lần/ngày, sau ăn',
        quantity: 3,
        price: 120000,
        imageUrl: 'https://placehold.co/80x80/fef3c7/f59e0b?text=Metformin',
      },
      {
        productId: 'rx-003',
        name: 'Amlodipine 5mg',
        genericName: 'Amlodipine Besylate',
        dosage: '5mg × 1 lần/ngày, buổi sáng',
        quantity: 1,
        price: 145000,
        imageUrl: 'https://placehold.co/80x80/fdf4ff/a855f7?text=Amlodipine',
      },
    ],
  },
  {
    id: 'prx-002',
    prescriptionCode: 'PK-MEDIC-2024-11-5678',
    issuedDate: '2024-11-03',
    expiryDate: '2025-05-03',
    status: 'valid',
    doctorName: 'BS. Trần Thị Lan',
    doctorSpecialty: 'Tim mạch',
    hospital: 'Phòng khám Medic',
    diagnosis: 'Tăng huyết áp nguyên phát (I10) + Rối loạn lipid máu',
    thumbnailUrl: 'https://placehold.co/400x560/eff6ff/3b82f6?text=Đơn+thuốc+%232',
    medicines: [
      {
        productId: 'rx-003',
        name: 'Amlodipine 5mg',
        genericName: 'Amlodipine Besylate',
        dosage: '5mg × 1 lần/ngày',
        quantity: 2,
        price: 145000,
        imageUrl: 'https://placehold.co/80x80/fdf4ff/a855f7?text=Amlodipine',
      },
      {
        productId: 'rx-004',
        name: 'Atorvastatin 20mg',
        genericName: 'Atorvastatin Calcium',
        dosage: '20mg × 1 lần/ngày, buổi tối',
        quantity: 2,
        price: 235000,
        imageUrl: 'https://placehold.co/80x80/fef9c3/a16207?text=Atorva',
      },
    ],
  },
  {
    id: 'prx-003',
    prescriptionCode: 'BV-NHI-TW-2024-03-0091',
    issuedDate: '2024-03-20',
    expiryDate: '2024-09-20',
    status: 'expired',
    doctorName: 'BS. Phạm Hoàng Long',
    doctorSpecialty: 'Nhi khoa — Hô hấp',
    hospital: 'BV Nhi Trung Ương',
    diagnosis: 'Viêm phế quản cấp tính (J20.9)',
    thumbnailUrl: 'https://placehold.co/400x560/f9fafb/9ca3af?text=Đơn+thuốc+%233',
    notes: 'Uống đủ liệu trình 7 ngày. Không tự ý ngừng kháng sinh.',
    medicines: [
      {
        productId: 'rx-005',
        name: 'Augmentin 457mg/5ml',
        genericName: 'Amoxicillin + Clavulanic Acid',
        dosage: '7.5ml × 2 lần/ngày',
        quantity: 2,
        price: 185000,
        imageUrl: 'https://placehold.co/80x80/fef3c7/d97706?text=Augmentin',
      },
    ],
  },
  {
    id: 'prx-004',
    prescriptionCode: 'BV-VIET-DUC-2025-01-3312',
    issuedDate: '2025-01-10',
    expiryDate: '2025-07-10',
    status: 'valid',
    doctorName: 'BS. Lê Quang Huy',
    doctorSpecialty: 'Dị ứng — Miễn dịch lâm sàng',
    hospital: 'BV Việt Đức',
    diagnosis: 'Viêm mũi dị ứng mãn tính (J30.1)',
    thumbnailUrl: 'https://placehold.co/400x560/fdf4ff/a855f7?text=Đơn+thuốc+%234',
    medicines: [
      {
        productId: 'rx-001',
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin Trihydrate',
        dosage: '500mg × 3 lần/ngày, sau ăn',
        quantity: 2,
        price: 85000,
        imageUrl: 'https://placehold.co/80x80/fef3c7/f59e0b?text=Amoxicillin',
      },
    ],
  },
  {
    id: 'prx-005',
    prescriptionCode: 'PK-ANH-DUONG-2023-12-7743',
    issuedDate: '2023-12-05',
    expiryDate: '2024-06-05',
    status: 'expired',
    doctorName: 'BS. Ngô Thị Hương',
    doctorSpecialty: 'Nội tiết',
    hospital: 'Phòng khám Ánh Dương',
    diagnosis: 'Đái tháo đường type 2 — tái khám định kỳ',
    thumbnailUrl: 'https://placehold.co/400x560/f9fafb/9ca3af?text=Đơn+thuốc+%235',
    medicines: [
      {
        productId: 'rx-002',
        name: 'Metformin 850mg',
        genericName: 'Metformin HCl',
        dosage: '850mg × 1 lần/ngày',
        quantity: 2,
        price: 120000,
        imageUrl: 'https://placehold.co/80x80/fef3c7/f59e0b?text=Metformin',
      },
    ],
  },
  {
    id: 'prx-006',
    prescriptionCode: 'BV-115-2025-02-9901',
    issuedDate: '2025-02-28',
    expiryDate: '2025-08-28',
    status: 'valid',
    doctorName: 'BS. Võ Minh Tuấn',
    doctorSpecialty: 'Tim mạch can thiệp',
    hospital: 'BV 115 TP.HCM',
    diagnosis: 'Bệnh mạch vành mãn tính — ổn định (I25.1)',
    thumbnailUrl: 'https://placehold.co/400x560/fff7ed/f97316?text=Đơn+thuốc+%236',
    notes: 'Không ngưng thuốc đột ngột. Liên hệ BS ngay nếu đau ngực.',
    medicines: [
      {
        productId: 'rx-004',
        name: 'Atorvastatin 20mg',
        genericName: 'Atorvastatin Calcium',
        dosage: '20mg × 1 lần/ngày',
        quantity: 3,
        price: 235000,
        imageUrl: 'https://placehold.co/80x80/fef9c3/a16207?text=Atorva',
      },
      {
        productId: 'rx-003',
        name: 'Amlodipine 5mg',
        genericName: 'Amlodipine Besylate',
        dosage: '5mg × 1 lần/ngày',
        quantity: 3,
        price: 145000,
        imageUrl: 'https://placehold.co/80x80/fdf4ff/a855f7?text=Amlodipine',
      },
    ],
  },
]
