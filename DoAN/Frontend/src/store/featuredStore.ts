import { create } from 'zustand';
import axiosClient from '../api/axiosClient';
import { type Product } from '../types';

// Type khớp với những gì ProductCard cần
export interface FeaturedProduct extends Product {
  id: string;           // alias của _id để tương thích
  imageUrl: string;     // lấy images[0] hoặc placeholder
  inStock: boolean;     // derived từ quantity > 0
  quantity: number;
}

// Giữ lại export alias Product để tương thích với code cũ
export type { FeaturedProduct as Product };

interface FeaturedStore {
  products: FeaturedProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

// Map raw API data → FeaturedProduct
function mapProduct(raw: any): FeaturedProduct {
  const id = raw._id || raw.id || '';
  return {
    _id: id,
    id,
    name: raw.name || '',
    description: raw.description || '',
    price: raw.price || 0,
    quantity: raw.stock_quantity ?? raw.quantity ?? 0,
    inStock: (raw.stock_quantity ?? raw.quantity ?? 0) > 0,
    images: raw.images || [],
    imageUrl: raw.images?.[0] || raw.imageUrl || `https://placehold.co/200x200/e0f2fe/0284c7?text=${encodeURIComponent(raw.name?.slice(0,8) || 'Thuốc')}`,
    type: raw.type || raw.productType || 'otc', // fallback
    manufacturer: raw.manufacturer || raw.brand || '',
    unit: raw.unit || 'hộp',
    badge: raw.badge || '',
    stock_quantity: raw.stock_quantity ?? raw.quantity ?? 0,
    genericName: raw.genericName || '',
    categoryId: raw.categoryId || '',
    form: raw.form || 'tablet',
    tags: raw.tags || [],
    tabs: raw.tabs || {
      ingredients: raw.genericName || '',
      indications: raw.description || '',
      dosage: '',
      sideEffects: '',
    },
    is_prescription: raw.type === 'rx',
  };
}

export const useFeaturedStore = create<FeaturedStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await axiosClient.get('/products');
      // Interceptor đã unwrap response.data, nên res = { success, data: [...] }
      const rawList = res?.data || res || [];
      const products = Array.isArray(rawList)
        ? rawList.map(mapProduct)
        : [];
      set({ products, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.data?.message || error?.message || 'Không thể tải danh sách sản phẩm',
        isLoading: false,
      });
    }
  },
}));
