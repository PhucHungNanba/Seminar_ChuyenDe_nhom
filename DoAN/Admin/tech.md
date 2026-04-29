# Cấu trúc dự án và Công cụ sử dụng (PharmaCare Admin)

## 1. Công cụ & Thư viện (Tech Stack)

Dự án được xây dựng dựa trên các công nghệ hiện đại dành cho Frontend:

* **Framework cốt lõi:** React 18, TypeScript
* **Công cụ Build (Bundler):** Vite
* **Quản lý State:** Zustand (nhỏ gọn, hiệu năng cao)
* **Routing:** React Router DOM v6
* **Styling & UI:** 
  * Tailwind CSS (Utility-first CSS framework)
  * Framer Motion (Thư viện tạo animation mượt mà)
  * Lucide React (Bộ icon vector chuẩn)
* **Trực quan hóa dữ liệu (Charts):** Recharts

## 2. Cấu trúc thư mục dự án

```text
Admin/
├── src/
│   ├── components/         # Các thành phần UI có thể tái sử dụng
│   │   └── layout/         # Component layout chung (Sidebar, Header, v.v.)
│   ├── data/               # Chứa dữ liệu giả (Mock data) để phát triển UI
│   │   ├── mockInventory.ts
│   │   └── mockRxRequests.ts
│   ├── pages/              # Các trang chính của giao diện Admin
│   │   ├── Analytics/      # Trang thống kê, biểu đồ
│   │   ├── Dashboard/      # Trang tổng quan
│   │   ├── Inventory/      # Trang quản lý kho hàng
│   │   └── RxApproval/     # Trang duyệt đơn thuốc (Prescription Approval)
│   ├── store/              # Chứa các file quản lý state toàn cục (Zustand)
│   │   └── useAdminStore.ts
│   ├── App.tsx             # Component gốc chứa cấu hình Routing
│   ├── index.css           # File CSS toàn cục (chứa cấu hình Tailwind)
│   └── main.tsx            # Điểm entry của ứng dụng React
├── package.json            # Chứa thông tin cấu hình và danh sách thư viện (dependencies)
├── tailwind.config.js      # Cấu hình cho Tailwind CSS
├── tsconfig.json           # Cấu hình TypeScript
└── vite.config.ts          # Cấu hình Vite
```

## 3. Kiến trúc luồng hoạt động cơ bản
* **UI Components:** Phân chia rõ ràng thành Layout và Pages.
* **State Management:** Dữ liệu về kho hàng, duyệt đơn được quản lý tập trung bằng `Zustand` tại `useAdminStore.ts`.
* **Mock Data:** Hiện đang sử dụng mock data để mô phỏng API backend.
