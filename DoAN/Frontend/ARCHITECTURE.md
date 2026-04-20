# PharmaCare Frontend — Architecture & Data Structure Guide

> Tài liệu này mô tả toàn bộ cấu trúc dữ liệu, component hierarchy, và luồng nghiệp vụ
> của dự án PharmaCare Frontend. Viết để AI/developer mới có thể onboard nhanh.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` trong `index.css`) |
| State | Zustand (no persist middleware yet) |
| Routing | React Router v7 (`BrowserRouter`) |
| Animation | Framer Motion (`motion`, `AnimatePresence`) |
| Icons | lucide-react |
| Dev server | `npm run dev` → `http://localhost:5173` |

---

## 2. Route Map

```
/                    → HomePage
/products            → ProductsPage      (?q=, ?type=otc|rx, ?form=device|tablet|...)
/products/:id        → MedicineDetailPage
/cart                → CartPage
/checkout            → CheckoutPage
/orders/:id          → OrderTrackingPage  (mock: ORD-001, ORD-002)
/profile             → UserProfilePage
```

---

## 3. Core Data Models (TypeScript Interfaces)

### 3.1 Product — `src/data/allProducts.ts` ⭐ Source of Truth

```ts
// Dạng bào chế
type ProductForm = 'tablet' | 'liquid' | 'capsule' | 'device'

// Nội dung tab chi tiết (dùng ở MedicineDetailPage)
interface TabContent {
  ingredients: string   // Thành phần
  indications: string   // Chỉ định
  dosage: string        // Liều lượng
  sideEffects: string   // Tác dụng phụ
}

interface Product {
  id: string              // VD: 'otc-001', 'rx-002', 'med-003'
  name: string
  genericName: string     // Hoạt chất
  manufacturer: string
  type: 'otc' | 'rx'     // OTC = không kê đơn | rx = kê đơn
  form: ProductForm
  price: number           // VND
  unit: string            // VD: 'hộp 100 viên'
  imageUrl: string
  description: string
  rating: number          // 1.0–5.0
  reviewCount: number
  inStock: boolean
  tags: string[]
  badge?: string          // 'Bán chạy' | 'Yêu thích' | 'Mới' | 'Sale'
  tabs: TabContent        // Nội dung tab; dùng DEFAULT_TABS nếu chưa có real data
}
```

**17 sản phẩm** trong `ALL_PRODUCTS`:
- OTC Tablet: `otc-001` (Paracetamol), `otc-003` (Cetirizine), `otc-005` (Aspirin), `otc-006` (Ibuprofen)
- OTC Capsule: `otc-002` (Vitamin C), `otc-004` (Omega-3), `otc-007` (Vitamin D3)
- OTC Liquid: `otc-008` (Prospan), `otc-009` (NaCl)
- Rx Tablet: `rx-001` (Amoxicillin), `rx-002` (Metformin), `rx-003` (Amlodipine), `rx-004` (Atorvastatin)
- Rx Liquid: `rx-005` (Augmentin)
- Device: `med-001` (Nhiệt kế), `med-002` (Máy huyết áp), `med-003` (Accu-Chek)

**Helpers xuất từ file:**
```ts
export function getMedicineById(id: string): Product | undefined
// → tìm trong ALL_PRODUCTS, inject TABS_MAP[id] nếu có, else DEFAULT_TABS
```

**Tab content thật** chỉ có cho: `otc-001`, `rx-001`, `otc-002`, `rx-002`.
Còn lại dùng `DEFAULT_TABS` (placeholder text).

---

### 3.2 CartItem — `src/store/cartStore.ts`

```ts
interface CartItem {
  id: string              // khớp với Product.id
  name: string
  type: 'otc' | 'rx'
  price: number
  quantity: number
  imageUrl?: string
  prescription: {         // null nếu OTC hoặc chưa upload
    fileUrl: string       // URL ảnh đơn thuốc (base64 hoặc blob URL)
    fileName: string
    uploadedAt: string    // ISO string
  } | null
}
```

**Zustand actions:**
```ts
addItem(item: Omit<CartItem, 'prescription'>)  // tự set prescription = null
removeItem(id: string)
updateQuantity(id: string, qty: number)
setPrescription(itemId: string, prescription)  // 1 item ↔ 1 prescription
totalCount(): number
```

**Business rule checkout:**
```ts
const canCheckout = items.filter(i => i.type === 'rx' && !i.prescription).length === 0
```

---

### 3.3 FeaturedProduct — `src/store/featuredStore.ts`

```ts
interface FeaturedProduct {
  id: string        // khớp với Product.id trong allProducts.ts
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
  badge?: string
}
// 8 sản phẩm hard-coded — subset của ALL_PRODUCTS, hiển thị ở HomePage
```

---

### 3.4 AssociationRule — `src/data/mockAssociationRules.ts`

```ts
// Cấu trúc mô phỏng kết quả Apriori / FP-Growth từ Backend
interface AssociationRuleProduct {
  id: string; name: string; price: number; unit: string
  imageUrl: string; type: 'otc' | 'rx'; manufacturer: string; badge?: string
}

interface AssociationRule {
  ruleId: string
  antecedentId: string          // ID sản phẩm "nguồn" (user đang xem / trong giỏ)
  consequent: AssociationRuleProduct   // sản phẩm gợi ý
  confidence: number            // 0–1 → hiển thị "N% mua kèm"
  lift: number                  // >2.5 → badge "Phổ biến"
  support: number               // 0–1
  reason?: string               // label từ BE
}

// Helper
export function getRulesForProducts(productIds: string[]): AssociationRule[]
// → union rules của nhiều SP, dedup theo consequent.id, sort lift giảm dần
// BE integration: GET /api/recommendations?productId=xxx → AssociationRule[]
```

**14 mock rules** covering: otc-001, rx-001, otc-002, rx-002, otc-003, otc-004.

---

### 3.5 SavedPrescription — `src/data/mockPrescriptionVault.ts`

```ts
type PrescriptionStatus = 'valid' | 'expired'

interface PrescriptionMedicine {
  productId: string   // khớp với Product.id trong allProducts.ts
  name: string
  genericName: string
  dosage: string      // VD: "500mg × 2 lần/ngày, sau ăn"
  quantity: number    // số hộp
  price: number
  imageUrl: string
}

interface SavedPrescription {
  id: string
  prescriptionCode: string      // Mã từ BV/phòng khám
  issuedDate: string            // ISO date
  expiryDate: string            // ISO date (6 tháng sau issuedDate theo quy định)
  status: PrescriptionStatus
  doctorName: string
  doctorSpecialty: string
  hospital: string
  diagnosis: string             // ICD-10 friendly
  thumbnailUrl: string          // ảnh đơn thuốc đã upload
  medicines: PrescriptionMedicine[]
  notes?: string
}
// 6 mock prescriptions: prx-001 đến prx-006 (4 valid, 2 expired)
// BE integration: GET /api/users/me/prescriptions → SavedPrescription[]
```

---

## 4. Component Hierarchy

```
App.tsx
└── BrowserRouter
    ├── MockCartSeeder          ← seed giỏ hàng mock khi app load lần đầu
    └── Routes
        ├── / → MainLayout > HomePage
        │         ├── HeroBanner
        │         ├── CategoryGrid                (3 card, navigate /products?type=...)
        │         └── FeaturedProducts            (8 SP từ featuredStore)
        │
        ├── /products → MainLayout > ProductsPage
        │         ├── MobileDrawer               (slide left, lock body scroll)
        │         ├── aside.lg:block             (FilterSidebar desktop, sticky)
        │         │   └── SidebarContent         (CheckboxItem OTC/Rx/form)
        │         └── main
        │             ├── SearchBar              (id="products-search-input")
        │             ├── Sort <select>          (id="products-sort-select")
        │             ├── Active filter pills
        │             └── CSS Grid               (auto-fill minmax 210px)
        │                 └── ProductCard[]
        │
        ├── /products/:id → MainLayout > MedicineDetailPage
        │         ├── Breadcrumb
        │         ├── Left: image + thumbnail strip
        │         ├── Right: info, TypeBadge, Rx warning, qty stepper, add-to-cart
        │         ├── Tab section (4 tabs, layoutId animated underline)
        │         └── FrequentlyBoughtTogether    (FBT — data mining section)
        │
        ├── /cart → MainLayout > CartPage
        │         ├── Rx warning banner          (AnimatePresence)
        │         ├── CartItem[] (col-span-2)
        │         │   └── PrescriptionUploader   (Rx only)
        │         │       └── PrescriptionModal  (slide-up, drag-drop)
        │         ├── Order summary (col-span-1, sticky)
        │         │   └── Checkout button        (locked/unlocked AnimatePresence)
        │         └── FrequentlyBoughtTogether   (title: "Có thể bạn cũng cần")
        │
        ├── /checkout → MainLayout > CheckoutPage
        │         ├── Delivery form (CSS Grid 2-col)
        │         ├── Payment method selector    (3 options, AnimatePresence)
        │         ├── Order summary sticky
        │         └── Success screen             (spring scale-in)
        │
        ├── /orders/:id → MainLayout > OrderTrackingPage
        │         ├── StepperProgress            (4 steps, animated fill bar)
        │         ├── Delivery person box        (conditional on shipping/done)
        │         └── Order sidebar              (items + prescription thumbnails)
        │
        └── /profile → MainLayout > UserProfilePage
                  ├── Sidebar (lg:flex, sticky)
                  │   ├── Avatar card
                  │   └── Nav (5 items)
                  └── Main content (AnimatePresence panel switch)
                      └── PrescriptionVault      (default active panel)
                          ├── Filter tabs        (Tất cả / Hợp lệ / Hết hạn)
                          ├── PrescriptionCard[] (CSS Grid auto-fill minmax 240px)
                          └── PrescriptionModal  (detail + reorder CTA)
```

---

## 5. Shared Components

### `TypeBadge` — `src/components/common/TypeBadge.tsx`
```tsx
<TypeBadge type="otc" size="sm" />   // xanh lá: "● Không kê đơn (OTC)"
<TypeBadge type="rx"  size="md" />   // vàng:    "⚠️ Kê đơn (Rx)"
// size: 'sm' | 'md'
```

### `FrequentlyBoughtTogether` — `src/components/common/FrequentlyBoughtTogether.tsx`
```tsx
<FrequentlyBoughtTogether
  associationRulesData={AssociationRule[]}  // kết quả data mining từ BE
  currentProductIds={string[]}              // loại trừ SP đang xem/trong giỏ
  title="Thường được mua cùng nhau"
  maxItems={8}
  isLoading={false}                         // hiển thị skeleton khi fetch BE
/>
// Dùng ở: MedicineDetailPage (cuối trang) + CartPage (cuối trang)
```

### `StepperProgress` — `src/components/order/StepperProgress.tsx`
```tsx
type StepKey = 'pending' | 'packing' | 'shipping' | 'done'

export const ORDER_STEPS: { key: StepKey; label: string }[]

<StepperProgress currentStep="shipping" />
// → animated fill bar (scaleX), done steps = emerald, active = sky pulsing ring
```

---

## 6. Luồng nghiệp vụ quan trọng

### 6.1 Luồng mua thuốc OTC
```
ProductsPage → click "Thêm vào giỏ"
→ cartStore.addItem({ type: 'otc', prescription: null })
→ CartPage: item hiển thị, KHÔNG có PrescriptionUploader
→ canCheckout = true (vì không có Rx thiếu đơn)
→ CheckoutPage → Success
```

### 6.2 Luồng mua thuốc Rx
```
ProductsPage → click "Chi tiết" → MedicineDetailPage
→ "Thêm vào giỏ" → cartStore.addItem({ type: 'rx', prescription: null })
→ CartPage: banner cảnh báo Rx, PrescriptionUploader hiện ra
→ User upload ảnh đơn thuốc → PrescriptionModal
→ cartStore.setPrescription(itemId, { fileUrl, fileName, uploadedAt })
→ canCheckout = true → CheckoutPage
```

### 6.3 Luồng "Mua lại" từ PrescriptionVault
```
/profile → PrescriptionVault → click "Mua lại" (chỉ valid)
→ forEach medicine in prx.medicines:
    cartStore.addItem({ type: 'rx', ... })
    cartStore.setPrescription(productId, {
      fileUrl: prx.thumbnailUrl,   ← ảnh đơn thuốc tự động đính kèm
      fileName: prescriptionCode + '.jpg'
    })
→ Toast: "Đã thêm N thuốc vào giỏ hàng!"
→ CartPage: tất cả Rx items đã có prescription → canCheckout = true ngay
```

### 6.4 Luồng Navbar Search → ProductsPage filter
```
Navbar input → submit → navigate('/products?q=paracetamol')
ProductsPage mount → useSearchParams() → useEffect:
  searchParams.get('q') → setQuery('paracetamol')
→ useMemo tự filter ALL_PRODUCTS → grid cập nhật
```

### 6.5 Luồng Category link → ProductsPage filter
```
Navbar "Thuốc OTC" → navigate('/products?type=otc')
ProductsPage useEffect:
  searchParams.get('type') → setFilters({ types: new Set(['otc']) })
→ grid chỉ hiển thị OTC products
```

---

## 7. Key Business Rules

| # | Rule |
|---|---|
| 1 | OTC items **không bao giờ** có PrescriptionUploader |
| 2 | Rx items **luôn** có PrescriptionUploader trong CartPage |
| 3 | `prescription` map **1 item ↔ 1 prescription** (không global) |
| 4 | `canCheckout = rxItems.filter(i => !i.prescription).length === 0` |
| 5 | Rx `ProductCard` → **không** có "Thêm vào giỏ" → phải qua `/products/:id` |
| 6 | `StepperProgress` nhận `currentStep: StepKey`, tự tính `progressPct` |
| 7 | "Mua lại" từ Vault: `setPrescription()` phải gọi **sau** `addItem()` |
| 8 | FBT không render nếu `rules.length === 0` sau khi loại `currentProductIds` |
| 9 | PrescriptionCard badge "Còn N ngày": chỉ render khi `status=valid && daysLeft > 0 && daysLeft <= 30` |

---

## 8. File Map đầy đủ

```
Frontend/
├── src/
│   ├── App.tsx                    # BrowserRouter + Routes + MockCartSeeder
│   ├── main.tsx
│   ├── index.css                  # @import url(Google Fonts); @import "tailwindcss"
│   │
│   ├── data/
│   │   ├── allProducts.ts         # ⭐ Source of truth: 17 SP, Product interface, getMedicineById()
│   │   ├── mockAssociationRules.ts # 14 rules Apriori/FP-Growth + getRulesForProducts()
│   │   └── mockPrescriptionVault.ts # 6 đơn thuốc + SavedPrescription interface
│   │   # (mockMedicines.ts đã deprecated — không dùng nữa)
│   │
│   ├── store/
│   │   ├── cartStore.ts           # Zustand: CartItem, addItem, setPrescription
│   │   └── featuredStore.ts       # Zustand: 8 FeaturedProduct read-only
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── TypeBadge.tsx      # OTC/Rx badge — dùng ở mọi nơi
│   │   │   └── FrequentlyBoughtTogether.tsx  # Data mining slider
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Search, cart badge, category nav, mobile drawer
│   │   │   └── MainLayout.tsx     # sticky header + main + footer
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── PrescriptionUploader.tsx
│   │   │   └── PrescriptionModal.tsx
│   │   └── order/
│   │       └── StepperProgress.tsx
│   │
│   └── pages/
│       ├── Home/HomePage.tsx
│       ├── Products/ProductsPage.tsx
│       ├── MedicineDetail/MedicineDetailPage.tsx
│       ├── Cart/CartPage.tsx
│       ├── Checkout/CheckoutPage.tsx
│       ├── OrderTracking/OrderTrackingPage.tsx
│       └── Profile/UserProfilePage.tsx
│
├── PROGRESS.md    # Log tiến độ theo sprint [S1]–[S10]
├── fix.md         # Danh sách bug + cải tiến cần làm (BUG-xx, EMPTY-xx, UX-xx)
└── ARCHITECTURE.md  # File này
```

---

## 9. Patterns & Conventions

### CSS Grid responsive pattern
```tsx
// ProductsPage, FeaturedProducts, PrescriptionVault
style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}
```

### Animated list pattern (Framer Motion)
```tsx
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.div key={item.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      ...
    </motion.div>
  ))}
</AnimatePresence>
```

### Filter state pattern (ProductsPage)
```ts
// Dùng Set để toggle độc lập
interface Filters { types: Set<'otc'|'rx'>; forms: Set<ProductForm> }
// Toggle: new Set(prev); next.has(t) ? next.delete(t) : next.add(t)
// Toàn bộ filter + search + sort qua useMemo — không có store ngoài
```

### Rx gate pattern (CartPage)
```tsx
const rxMissingPrescription = items.filter(i => i.type === 'rx' && !i.prescription)
const canCheckout = rxMissingPrescription.length === 0
// Button: AnimatePresence giữa locked (disabled) và unlocked (pulse glow)
```

### URL param sync pattern (ProductsPage)
```ts
const [searchParams] = useSearchParams()
useEffect(() => {
  const q = searchParams.get('q')
  const type = searchParams.get('type') as 'otc' | 'rx' | null
  const form = searchParams.get('form') as ProductForm | null
  if (q) setQuery(q)
  if (type) setFilters(prev => ({ ...prev, types: new Set([type]) }))
  if (form) setFilters(prev => ({ ...prev, forms: new Set([form]) }))
}, [searchParams])
```

---

## 10. Backend Integration Points

Khi BE sẵn sàng, thay thế theo thứ tự:

| Mock hiện tại | BE endpoint | File cần sửa |
|---|---|---|
| `ALL_PRODUCTS` | `GET /api/products` | `ProductsPage`, `getMedicineById` |
| `getMedicineById(id)` | `GET /api/products/:id` | `MedicineDetailPage` |
| `getRulesForProducts(ids)` | `GET /api/recommendations?productId=` | `FrequentlyBoughtTogether` usage |
| `MOCK_PRESCRIPTIONS` | `GET /api/users/me/prescriptions` | `UserProfilePage` |
| `MOCK_ORDERS` | `GET /api/orders/:id` | `OrderTrackingPage` |
| `MockCartSeeder` (App.tsx) | Xóa khi có Auth | `App.tsx` |

Thêm `persist` middleware vào `cartStore` trước khi lên production:
```ts
import { persist } from 'zustand/middleware'
export const useCartStore = create<CartStore>()(
  persist((set, get) => ({ ... }), { name: 'pharmacare-cart' })
)
```
