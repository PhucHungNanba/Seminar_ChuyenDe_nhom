import { create } from 'zustand'

export interface FeaturedProduct {
  id: string
  name: string
  genericName: string
  manufacturer: string
  type: 'otc' | 'rx'
  price: number
  unit: string
  imageUrl: string
  description: string
  rating: number
  reviewCount: number
  inStock: boolean
  tags: string[]
  badge?: string // e.g. "Bán chạy", "Mới", "Sale"
}

interface FeaturedStore {
  products: FeaturedProduct[]
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'otc-001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'Dược Hậu Giang',
    type: 'otc',
    price: 25000,
    unit: 'hộp 100 viên',
    imageUrl: 'https://placehold.co/320x320/e0f2fe/0ea5e9?text=Paracetamol',
    description: 'Hạ sốt, giảm đau nhức đầu, đau cơ thông thường.',
    rating: 4.7,
    reviewCount: 1248,
    inStock: true,
    tags: ['Hạ sốt', 'Giảm đau'],
    badge: 'Bán chạy',
  },
  {
    id: 'rx-001',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    manufacturer: 'Pymepharco',
    type: 'rx',
    price: 85000,
    unit: 'hộp 2 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/320x320/fef3c7/f59e0b?text=Amoxicillin',
    description: 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp, tiết niệu.',
    rating: 4.5,
    reviewCount: 832,
    inStock: true,
    tags: ['Kháng sinh', 'Kê đơn'],
  },
  {
    id: 'otc-002',
    name: 'Vitamin C 1000mg',
    genericName: 'Ascorbic Acid',
    manufacturer: 'Traphaco',
    type: 'otc',
    price: 45000,
    unit: 'hộp 30 viên sủi',
    imageUrl: 'https://placehold.co/320x320/d1fae5/10b981?text=Vitamin+C',
    description: 'Bổ sung vitamin C, tăng cường miễn dịch, chống oxy hóa.',
    rating: 4.8,
    reviewCount: 2103,
    inStock: true,
    tags: ['Vitamin', 'Miễn dịch'],
    badge: 'Yêu thích',
  },
  {
    id: 'rx-002',
    name: 'Metformin 850mg',
    genericName: 'Metformin HCl',
    manufacturer: 'Stada Việt Nam',
    type: 'rx',
    price: 120000,
    unit: 'hộp 3 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/320x320/fef3c7/f59e0b?text=Metformin',
    description: 'Điều trị đái tháo đường type 2, kiểm soát đường huyết.',
    rating: 4.6,
    reviewCount: 567,
    inStock: true,
    tags: ['Tiểu đường', 'Kê đơn'],
  },
  {
    id: 'otc-003',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Dihydrochloride',
    manufacturer: 'Sanofi Việt Nam',
    type: 'otc',
    price: 38000,
    unit: 'hộp 10 viên',
    imageUrl: 'https://placehold.co/320x320/ede9fe/7c3aed?text=Cetirizine',
    description: 'Kháng histamine, điều trị dị ứng, viêm mũi dị ứng, mề đay.',
    rating: 4.4,
    reviewCount: 945,
    inStock: true,
    tags: ['Dị ứng', 'Kháng histamine'],
    badge: 'Mới',
  },
  {
    id: 'otc-004',
    name: 'Omega-3 Fish Oil',
    genericName: 'EPA + DHA 1000mg',
    manufacturer: 'Nature Made',
    type: 'otc',
    price: 280000,
    unit: 'hộp 60 viên nang',
    imageUrl: 'https://placehold.co/320x320/fff7ed/f97316?text=Omega-3',
    description: 'Hỗ trợ tim mạch, não bộ, giảm triglyceride máu.',
    rating: 4.9,
    reviewCount: 3412,
    inStock: true,
    tags: ['Tim mạch', 'Não bộ'],
    badge: 'Bán chạy',
  },
  {
    id: 'med-001',
    name: 'Nhiệt kế điện tử',
    genericName: 'Digital Thermometer',
    manufacturer: 'Omron',
    type: 'otc',
    price: 185000,
    unit: 'cái',
    imageUrl: 'https://placehold.co/320x320/f0fdf4/16a34a?text=Nhiệt+kế',
    description: 'Đo nhiệt độ cơ thể chính xác trong 60 giây, màn hình LCD.',
    rating: 4.7,
    reviewCount: 728,
    inStock: true,
    tags: ['Vật tư y tế', 'Đo lường'],
  },
  {
    id: 'med-002',
    name: 'Máy đo huyết áp',
    genericName: 'Blood Pressure Monitor',
    manufacturer: 'Omron HEM-7156',
    type: 'otc',
    price: 1250000,
    unit: 'máy',
    imageUrl: 'https://placehold.co/320x320/fdf2f8/ec4899?text=Huyết+áp',
    description: 'Máy đo huyết áp bắp tay tự động, cảnh báo rối loạn nhịp tim.',
    rating: 4.8,
    reviewCount: 1563,
    inStock: true,
    tags: ['Vật tư y tế', 'Tim mạch'],
    badge: 'Sale',
  },
]

export const useFeaturedStore = create<FeaturedStore>(() => ({
  products: FEATURED_PRODUCTS,
}))
