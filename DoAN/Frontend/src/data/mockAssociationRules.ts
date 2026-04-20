/**
 * Mock Association Rules — Thường được mua cùng nhau
 *
 * Cấu trúc này mô phỏng kết quả thuật toán khai phá dữ liệu (data mining),
 * cụ thể là Association Rule Mining (Apriori / FP-Growth).
 *
 * Khi Backend sẵn sàng, API sẽ trả về mảng `AssociationRule[]`
 * và truyền vào component qua prop `associationRulesData`.
 *
 * Giải thích các field:
 *  - antecedent  : Sản phẩm "nguồn" (người dùng đang xem / đang có trong giỏ)
 *  - consequent  : Sản phẩm được gợi ý mua kèm
 *  - confidence  : Tỉ lệ phần trăm khách hàng mua cả hai (0–1)
 *  - lift        : Mức độ liên kết (> 1 là có ý nghĩa, > 2 là mạnh)
 *  - support     : Tần suất xuất hiện cùng nhau trong toàn bộ giao dịch
 */

export interface AssociationRuleProduct {
  id: string
  name: string
  price: number
  unit: string
  imageUrl: string
  type: 'otc' | 'rx'
  manufacturer: string
  badge?: string
}

export interface AssociationRule {
  ruleId: string
  antecedentId: string           // ID sản phẩm trigger
  consequent: AssociationRuleProduct
  confidence: number             // 0.0 – 1.0
  lift: number                   // thường 1.0 – 5.0+
  support: number                // 0.0 – 1.0
  reason?: string                // human-readable label từ BE (optional)
}

// ─── Mock data — giả lập kết quả từ Apriori/FP-Growth ────────────────────────

const PRODUCTS_POOL: Record<string, AssociationRuleProduct> = {
  'otc-001': {
    id: 'otc-001',
    name: 'Paracetamol 500mg',
    price: 25000,
    unit: 'hộp 100 viên',
    imageUrl: 'https://placehold.co/160x160/e0f2fe/0ea5e9?text=Paracetamol',
    type: 'otc',
    manufacturer: 'Dược Hậu Giang',
    badge: 'Bán chạy',
  },
  'otc-002': {
    id: 'otc-002',
    name: 'Vitamin C 1000mg',
    price: 45000,
    unit: 'hộp 30 viên sủi',
    imageUrl: 'https://placehold.co/160x160/d1fae5/10b981?text=Vitamin+C',
    type: 'otc',
    manufacturer: 'Traphaco',
    badge: 'Yêu thích',
  },
  'otc-003': {
    id: 'otc-003',
    name: 'Cetirizine 10mg',
    price: 38000,
    unit: 'hộp 10 viên',
    imageUrl: 'https://placehold.co/160x160/ede9fe/7c3aed?text=Cetirizine',
    type: 'otc',
    manufacturer: 'Sanofi Việt Nam',
  },
  'otc-004': {
    id: 'otc-004',
    name: 'Omega-3 Fish Oil',
    price: 280000,
    unit: 'hộp 60 viên nang',
    imageUrl: 'https://placehold.co/160x160/fff7ed/f97316?text=Omega-3',
    type: 'otc',
    manufacturer: 'Nature Made',
    badge: 'Bán chạy',
  },
  'otc-005': {
    id: 'otc-005',
    name: 'Aspirin 81mg',
    price: 55000,
    unit: 'hộp 30 viên',
    imageUrl: 'https://placehold.co/160x160/fef2f2/ef4444?text=Aspirin',
    type: 'otc',
    manufacturer: 'Bayer',
  },
  'otc-007': {
    id: 'otc-007',
    name: 'Vitamin D3 2000IU',
    price: 195000,
    unit: 'hộp 60 viên',
    imageUrl: 'https://placehold.co/160x160/fefce8/ca8a04?text=Vit+D3',
    type: 'otc',
    manufacturer: 'Blackmores',
  },
  'otc-008': {
    id: 'otc-008',
    name: 'Siro ho Prospan',
    price: 95000,
    unit: 'chai 100ml',
    imageUrl: 'https://placehold.co/160x160/ecfdf5/065f46?text=Prospan',
    type: 'otc',
    manufacturer: 'Engelhard',
    badge: 'Bán chạy',
  },
  'rx-001': {
    id: 'rx-001',
    name: 'Amoxicillin 500mg',
    price: 85000,
    unit: 'hộp 2 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/160x160/fef3c7/f59e0b?text=Amoxicillin',
    type: 'rx',
    manufacturer: 'Pymepharco',
  },
  'rx-002': {
    id: 'rx-002',
    name: 'Metformin 850mg',
    price: 120000,
    unit: 'hộp 3 vỉ × 10 viên',
    imageUrl: 'https://placehold.co/160x160/fef3c7/f59e0b?text=Metformin',
    type: 'rx',
    manufacturer: 'Stada Việt Nam',
  },
  'med-003': {
    id: 'med-003',
    name: 'Máy đo đường huyết',
    price: 650000,
    unit: 'máy + 10 que thử',
    imageUrl: 'https://placehold.co/160x160/f0f9ff/0369a1?text=Accu-Chek',
    type: 'otc',
    manufacturer: 'Roche',
    badge: 'Bán chạy',
  },
}

/**
 * Mock association rules keyed by antecedentId.
 * Backend sẽ thay thế dict này bằng API call:
 *   GET /api/recommendations?productId=xxx  → AssociationRule[]
 *   GET /api/recommendations?cartIds[]=a&cartIds[]=b → AssociationRule[]
 */
export const MOCK_ASSOCIATION_RULES: AssociationRule[] = [
  // Paracetamol → Vitamin C, Cetirizine, Prospan
  {
    ruleId: 'r-001',
    antecedentId: 'otc-001',
    consequent: PRODUCTS_POOL['otc-002'],
    confidence: 0.72,
    lift: 2.8,
    support: 0.18,
    reason: 'Mua kèm phổ biến',
  },
  {
    ruleId: 'r-002',
    antecedentId: 'otc-001',
    consequent: PRODUCTS_POOL['otc-003'],
    confidence: 0.55,
    lift: 2.1,
    support: 0.12,
    reason: 'Thường dùng cùng trị cảm',
  },
  {
    ruleId: 'r-003',
    antecedentId: 'otc-001',
    consequent: PRODUCTS_POOL['otc-008'],
    confidence: 0.61,
    lift: 3.2,
    support: 0.14,
    reason: 'Bộ điều trị cảm ho sốt',
  },

  // Amoxicillin → Vitamin C, Prospan
  {
    ruleId: 'r-004',
    antecedentId: 'rx-001',
    consequent: PRODUCTS_POOL['otc-002'],
    confidence: 0.68,
    lift: 2.6,
    support: 0.15,
    reason: 'Tăng sức đề kháng khi dùng kháng sinh',
  },
  {
    ruleId: 'r-005',
    antecedentId: 'rx-001',
    consequent: PRODUCTS_POOL['otc-008'],
    confidence: 0.47,
    lift: 1.9,
    support: 0.09,
    reason: 'Điều trị nhiễm khuẩn đường hô hấp',
  },

  // Vitamin C → Vitamin D3, Omega-3
  {
    ruleId: 'r-006',
    antecedentId: 'otc-002',
    consequent: PRODUCTS_POOL['otc-007'],
    confidence: 0.81,
    lift: 3.5,
    support: 0.22,
    reason: 'Bộ vitamin tổng hợp',
  },
  {
    ruleId: 'r-007',
    antecedentId: 'otc-002',
    consequent: PRODUCTS_POOL['otc-004'],
    confidence: 0.63,
    lift: 2.4,
    support: 0.16,
    reason: 'Bổ sung vi chất đầy đủ',
  },

  // Metformin → Máy đo đường huyết, Aspirin
  {
    ruleId: 'r-008',
    antecedentId: 'rx-002',
    consequent: PRODUCTS_POOL['med-003'],
    confidence: 0.76,
    lift: 4.1,
    support: 0.19,
    reason: 'Theo dõi đường huyết tại nhà',
  },
  {
    ruleId: 'r-009',
    antecedentId: 'rx-002',
    consequent: PRODUCTS_POOL['otc-005'],
    confidence: 0.52,
    lift: 2.3,
    support: 0.11,
    reason: 'Phòng ngừa biến chứng tim mạch',
  },
  {
    ruleId: 'r-010',
    antecedentId: 'rx-002',
    consequent: PRODUCTS_POOL['otc-004'],
    confidence: 0.44,
    lift: 1.8,
    support: 0.09,
    reason: 'Hỗ trợ chuyển hóa lipid',
  },

  // Omega-3 → Aspirin, Vitamin D3
  {
    ruleId: 'r-011',
    antecedentId: 'otc-004',
    consequent: PRODUCTS_POOL['otc-005'],
    confidence: 0.58,
    lift: 2.2,
    support: 0.13,
    reason: 'Bảo vệ tim mạch toàn diện',
  },
  {
    ruleId: 'r-012',
    antecedentId: 'otc-004',
    consequent: PRODUCTS_POOL['otc-007'],
    confidence: 0.71,
    lift: 3.0,
    support: 0.17,
    reason: 'Bộ supplement cao cấp',
  },

  // Cetirizine → Prospan, Paracetamol
  {
    ruleId: 'r-013',
    antecedentId: 'otc-003',
    consequent: PRODUCTS_POOL['otc-008'],
    confidence: 0.59,
    lift: 2.5,
    support: 0.13,
    reason: 'Điều trị dị ứng đường hô hấp',
  },
  {
    ruleId: 'r-014',
    antecedentId: 'otc-003',
    consequent: PRODUCTS_POOL['otc-001'],
    confidence: 0.65,
    lift: 2.7,
    support: 0.15,
    reason: 'Giảm triệu chứng cảm dị ứng',
  },
]

/**
 * Helper: lấy các rule liên quan đến 1 sản phẩm (antecedentId match)
 * hoặc nhiều sản phẩm (giỏ hàng) — union + dedup theo consequent.id.
 *
 * Backend sẽ thay thế hàm này bằng API call thật.
 */
export function getRulesForProducts(productIds: string[]): AssociationRule[] {
  const seen = new Set<string>()
  const results: AssociationRule[] = []

  for (const rule of MOCK_ASSOCIATION_RULES) {
    if (productIds.includes(rule.antecedentId)) {
      // Loại trừ consequent trùng với sản phẩm người dùng đang xem/giỏ hàng
      if (productIds.includes(rule.consequent.id)) continue
      // Dedup: chỉ giữ rule với confidence cao nhất nếu cùng consequent
      if (!seen.has(rule.consequent.id)) {
        seen.add(rule.consequent.id)
        results.push(rule)
      }
    }
  }

  // Sắp xếp theo lift giảm dần (rule mạnh nhất lên đầu)
  return results.sort((a, b) => b.lift - a.lift)
}
