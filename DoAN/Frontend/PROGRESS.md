# PharmaCare Frontend — Progress Log

> **Stack:** React 18 + Vite + TypeScript + Tailwind CSS v4 + Zustand + Framer Motion + React Router v7

## Quick Start

```bash
cd Frontend
npm install
npm run dev          # http://localhost:5173
```

---

## ✅ Done

### [S1] Project Setup + Navbar + MainLayout
- Vite React TSX, Tailwind CSS v4 (`@tailwindcss/vite`)
- `Navbar`: search dropdown, cart badge, mobile hamburger drawer
- `MainLayout`: sticky header, main content area, footer 4 cột
- `cartStore.ts`: Zustand store với schema hỗ trợ Rx prescription map

### [S2] CartPage + Rx Prescription Gate
- Route: `/cart`
- Layout: item list (col-span-2) + sticky order summary sidebar (col-span-1)
- `CartItem`: OTC badge (green) / Rx badge (amber ⚠️) + quantity stepper
- `PrescriptionUploader`: nút mở modal, inline preview sau upload
- Checkout gate: disabled nếu bất kỳ Rx item nào chưa có đơn thuốc
- Prescription **map 1-1** vào đúng `cartItem.prescription` (không global)

### [S3] Framer Motion Animations
- `PrescriptionModal`: slide-up từ bottom (spring physics), backdrop blur, drag-drop zone
- Checkout button: pulse glow ring khi tất cả Rx đã upload
- `AnimatePresence` transitions: locked ↔ unlocked button, banner show/hide

### [S4] MedicineDetailPage
- Route: `/products/:id` — `useParams` + `getMedicineById()`
- Layout 2 cột (image gallery trái, info phải), TypeBadge, hộp cảnh báo đỏ Rx
- Tab system (Thành phần / Chỉ định / Liều lượng / Tác dụng phụ) + `layoutId` animated underline
- Nút "Thêm vào giỏ" với qty stepper, feedback animation sau 2s

### [S5] CheckoutPage
- Route: `/checkout`
- Layout 2 cột: form giao hàng (col-span-2) + order summary sticky (col-span-1)
- Form: CSS Grid 2 cột, icon trong input, validation inline regex SĐT
- 3 phương thức thanh toán: COD / Thẻ / Chuyển khoản — `AnimatePresence` CheckCircle khi active
- Order summary: cart items + TypeBadge + trạng thái Rx prescription từ Zustand
- Success screen: spring scale-in + mã đơn `#PC{timestamp}`

### [S6] OrderTrackingPage + StepperProgress
- Route: `/orders/:id` — mock data 2 đơn: ORD-001 (shipping), ORD-002 (packing)
- `StepperProgress` (reusable component):
  - 4 bước: Chờ duyệt → Dược sĩ đóng gói → Đang giao → Đã nhận
  - Animated green fill bar: `scaleX: 0 → progressPct`, easing cubic, delay 0.2s
  - Done steps: xanh lá + CheckCircle spring pop; Active: xanh dương + pulsing ring
  - Step label: emerald (done) / sky (active) / slate (upcoming)
- Demo step switcher 1–4 để test animation
- Delivery person box (khi shipping/done): avatar, tên, rating, biển số, ETA, nút Gọi/Nhắn tin
- Sidebar: sản phẩm + TypeBadge + prescription thumbnail 1-1 với Rx item

### [S7] HomePage — HeroBanner + CategoryGrid + FeaturedProducts
- Route: `/`
- **HeroBanner**: gradient `#0369a1→#38bdf8`, blob decorations, floating icons (Framer Motion loop)
  - Trust badge "Được cấp phép Bộ Y Tế", 3 trust stats (10K+ SP / 500K+ KH / 4.9★)
  - CTA: "Xem danh mục thuốc" (`id="hero-cta-catalog"`) + "Tra cứu đơn hàng"
  - Trust row: 4 điểm (chính hãng / giao 2h / tư vấn miễn phí / bảo mật)
- **CategoryGrid**: 3 card lucide-react (`ClipboardList` / `ShoppingBag` / `Stethoscope`)
  - Hover `y:-6` + scale, click → navigate `/products`
- **FeaturedProducts**: data từ `useFeaturedStore` (8 SP)
  - CSS Grid `auto-fill minmax(220px,1fr)`, `whileInView` stagger fade-up
  - OTC: "Thêm vào giỏ" → "Đã thêm ✓" 1.8s; Rx: "Xem chi tiết"

### [S8] ProductsPage — FilterSidebar + Search + Sort + Grid
- Route: `/products`
- **FilterSidebar desktop** (`lg:block`, sticky top-6): checkbox OTC/Rx + 4 dạng bào chế, badge đếm SP/nhóm
- **MobileDrawer**: slide từ trái (spring), backdrop blur, lock body scroll, nút "Áp dụng"
  - Trigger: `id="mobile-filter-btn"` + badge số filter active
- **SearchBar** (`id="products-search-input"`): realtime filter `name` + `genericName` + `manufacturer` + `tags`
- **Sort** (`id="products-sort-select"`): 5 options — Mặc định / Giá↑ / Giá↓ / Rating / Tên A→Z
- **Active filter pills**: click để remove từng filter, nút "Xoá tất cả"
- **CSS Grid** `auto-fill minmax(210px,1fr)` + `AnimatePresence layout`
- **Empty state**: icon + message + nút xoá filter
- Logic: toàn bộ `useState` + `useMemo` nội bộ

### [S9] FrequentlyBoughtTogether — Gợi ý Data Mining
- Component: `src/components/common/FrequentlyBoughtTogether.tsx`
- Đặt cuối **MedicineDetailPage** (title: "Thường được mua cùng nhau") và **CartPage** (title: "Có thể bạn cũng cần")
- **Props API** sẵn sàng cho Backend:
  ```ts
  associationRulesData: AssociationRule[]  // BE đẩy kết quả Apriori/FP-Growth vào đây
  currentProductIds: string[]
  title?: string
  maxItems?: number   // default 8
  isLoading?: boolean // skeleton loader
  ```
- `AssociationRule`: `{ ruleId, antecedentId, consequent: Product, confidence, lift, support, reason? }`
- **Slider ngang**: scroll touch + nút ←→ (tự disable khi hết scroll)
- **Confidence pill**: xanh ≥70% / vàng ≥50% / xám <50%
- **"Phổ biến" badge** khi lift ≥ 2.5
- **Skeleton loader** khi `isLoading=true`
- `getRulesForProducts(ids[])`: union rules của nhiều SP, dedup consequent, sort lift giảm dần
- 14 mock rules trong `mockAssociationRules.ts`

### [S10] UserProfilePage + PrescriptionVault
- Route: `/profile`
- **Layout**: Sidebar trái (sticky, `lg:flex`) + Main content phải
  - Sidebar: Avatar card (tên, email, stats 6 đơn/12 đơn hàng) + Nav 5 mục
  - Mobile: horizontal scroll chip nav
  - `AnimatePresence` panel switch giữa các nav item
- **PrescriptionVault** (panel chính):
  - Filter tabs: Tất cả / Hợp lệ / Hết hạn (CSS active indicator)
  - CSS Grid `auto-fill minmax(240px,1fr)`
  - **PrescriptionCard**: thumbnail, `StatusBadge` (xanh "Hợp lệ" / xám "Hết hạn"), badge "Còn N ngày" (cam khi ≤30 ngày), HSD gạch ngang khi expired, medicine pills, nút "Xem chi tiết" + "Mua lại"
  - **PrescriptionModal**: full detail (ảnh + chẩn đoán + BS + bệnh viện + ngày + notes + danh sách thuốc), nút "Mua lại theo đơn này"
  - **Toast** bottom-center: "Đã thêm N thuốc vào giỏ + link Xem giỏ hàng" (3s auto-dismiss)
- **Logic "Mua lại"**:
  - `addItem()` tất cả `prx.medicines` với `type: 'rx'`
  - `setPrescription(productId, { fileUrl: thumbnailUrl })` → **auto-attach** ảnh đơn 1-1
  - → CartPage: Rx items đã có prescription → `canCheckout = true` ngay
- 6 mock prescriptions trong `mockPrescriptionVault.ts` (4 valid, 2 expired)

---

## 📁 File Map

```
src/
├── App.tsx                                   # Routes + MockCartSeeder
├── index.css                                 # Google Fonts + Tailwind v4
├── main.tsx
│
├── data/
│   ├── mockMedicines.ts                      # 4 medicines + getMedicineById()
│   ├── allProducts.ts                        # 17 SP đầy đủ + type ProductForm
│   ├── mockAssociationRules.ts               # 14 rules Apriori/FP-Growth mock + getRulesForProducts()
│   └── mockPrescriptionVault.ts              # 6 đơn thuốc mock + types SavedPrescription
│
├── store/
│   ├── cartStore.ts                          # Zustand — CartItem, prescription 1-1 map
│   └── featuredStore.ts                      # Zustand — 8 FeaturedProduct cho HomePage
│
├── components/
│   ├── common/
│   │   ├── TypeBadge.tsx                     # OTC/Rx badge (size sm|md) — dùng khắp nơi
│   │   └── FrequentlyBoughtTogether.tsx      # Slider gợi ý data mining — dùng ở Detail + Cart
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── MainLayout.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── PrescriptionUploader.tsx
│   │   └── PrescriptionModal.tsx             # Slide-up Portal + drag-drop
│   └── order/
│       └── StepperProgress.tsx               # Reusable 4-step tracker + animated fill
│
└── pages/
    ├── Home/
    │   └── HomePage.tsx                      # HeroBanner + CategoryGrid + FeaturedProducts
    ├── Products/
    │   └── ProductsPage.tsx                  # FilterSidebar + Drawer + Search + Sort + Grid
    ├── Profile/
    │   └── UserProfilePage.tsx               # Sidebar nav + PrescriptionVault
    ├── Cart/CartPage.tsx
    ├── Checkout/CheckoutPage.tsx
    ├── MedicineDetail/MedicineDetailPage.tsx
    └── OrderTracking/OrderTrackingPage.tsx
```

---

## 🗺️ Route Map

| Path | Component | Ghi chú |
|---|---|---|
| `/` | `HomePage` | HeroBanner, CategoryGrid, FeaturedProducts |
| `/products` | `ProductsPage` | FilterSidebar + Search + Sort + Grid (17 SP) |
| `/products/:id` | `MedicineDetailPage` | Detail 2 cột, tab system, FBT cuối trang |
| `/cart` | `CartPage` | Rx gate, prescription upload, FBT cuối trang |
| `/checkout` | `CheckoutPage` | Form + payment + success screen |
| `/orders/:id` | `OrderTrackingPage` | Stepper + delivery box + order sidebar |
| `/profile` | `UserProfilePage` | PrescriptionVault + sidebar nav |

---

## 🔑 Key Business Rules (DO NOT BREAK)

1. **OTC items**: Không bao giờ hiển thị PrescriptionUploader
2. **Rx items**: Luôn có uploader, `prescription` field trong cartItem
3. **Prescription map**: `setPrescription(itemId, {...})` — 1 item ↔ 1 prescription
4. **Checkout gate**: `canCheckout = items.filter(i => i.type==='rx' && !i.prescription).length === 0`
5. **OrderDetail**: mỗi `orderItem` phải mang theo `prescription` đã upload
6. **StepperProgress**: nhận prop `currentStep: StepKey`, tự tính `progressPct = currentIdx / 3`
7. **Rx ProductCard**: không có nút "Thêm vào giỏ" trực tiếp — link sang `/products/:id`
8. **"Mua lại" từ PrescriptionVault**: `addItem()` + `setPrescription()` đồng thời → giỏ hàng sẵn sàng checkout ngay
9. **FBT rules**: chỉ hiển thị nếu `associationRulesData.length > 0` sau khi loại `currentProductIds`

---

## 🔌 Zustand Store Schema

### `cartStore.ts`
```ts
CartItem {
  id, name, type: 'otc'|'rx', price, quantity, imageUrl?,
  prescription: { fileUrl, fileName, uploadedAt } | null
}
Actions: addItem, removeItem, updateQuantity, setPrescription, totalCount()
```

### `featuredStore.ts`
```ts
FeaturedProduct {
  id, name, genericName, manufacturer,
  type: 'otc'|'rx', price, unit, imageUrl,
  description, rating, reviewCount, inStock,
  tags: string[], badge?: string
}
// 8 sản phẩm hard-coded, read-only
```

---

## 🧩 Data Schema

### `allProducts.ts`
```ts
type ProductForm = 'tablet' | 'liquid' | 'capsule' | 'device'
interface Product { ...FeaturedProduct fields + form: ProductForm }
// 17 sản phẩm: 12 OTC + 5 Rx, đa dạng dạng bào chế
```

### `mockAssociationRules.ts`
```ts
interface AssociationRule {
  ruleId: string
  antecedentId: string          // ID sản phẩm trigger
  consequent: AssociationRuleProduct
  confidence: number            // 0–1
  lift: number                  // badge "Phổ biến" khi >= 2.5
  support: number               // 0–1
  reason?: string               // human-readable label từ BE
}
// Helper: getRulesForProducts(productIds[]) → AssociationRule[] (sorted by lift desc)
// BE integration: GET /api/recommendations?productId=xxx → AssociationRule[]
```

### `mockPrescriptionVault.ts`
```ts
type PrescriptionStatus = 'valid' | 'expired'
interface PrescriptionMedicine {
  productId: string  // khớp id trong allProducts.ts
  name, genericName, dosage, quantity, price, imageUrl
}
interface SavedPrescription {
  id, prescriptionCode, issuedDate, expiryDate, status,
  doctorName, doctorSpecialty, hospital, diagnosis,
  thumbnailUrl, medicines: PrescriptionMedicine[], notes?
}
// BE integration: GET /api/users/me/prescriptions → SavedPrescription[]
```

---

## 🚧 TODO Next

- [ ] `AuthPage` — Login / Register (`/auth`)
- [ ] `OrdersPage` — Danh sách đơn hàng của user (`/orders`)
- [ ] Kết nối Navbar search → `ProductsPage` với `?q=` query param
- [ ] Phân trang / infinite scroll cho `ProductsPage`
- [ ] Wire "Tài khoản" trong Navbar → `/profile`
- [ ] Backend API thay thế toàn bộ mock data
- [ ] React Query / SWR cho data fetching + caching

---

## ⚠️ Gotchas

| Issue | Fix |
|---|---|
| `lucide-react` v1.x thiếu `Facebook`, `Youtube` | Dùng `Share2`, `PlayCircle` |
| PostCSS lỗi `@import must precede` | `@import url(Google Fonts)` phải đứng trước `@import "tailwindcss"` |
| Vite template là vanilla TS, không phải React | Phải tạo `main.tsx`, `App.tsx`, sửa `index.html` thủ công |
| `&&` trong PowerShell | Dùng 2 lệnh riêng, không dùng `cmd1 && cmd2` |
| `body.style.overflow` khi đóng Drawer | Luôn reset trong `useEffect` cleanup để tránh lock scroll |
| Rx item trong `ProductCard` | Không dùng `addItem` trực tiếp — link sang `/products/:id` |
| `getPrescription` sau "Mua lại" | `setPrescription` phải gọi sau `addItem` (item phải tồn tại trong store trước) |
| FBT không hiển thị | Kiểm tra `currentProductIds` có bị trùng với `consequent.id` trong rules không |
