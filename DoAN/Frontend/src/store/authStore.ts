import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';

export interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Pharmacist' | 'Customer';
  reward_points: number;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // API Gateway: /users -> user-service, route /login
          const res: any = await axiosClient.post('/users/login', { email, password });

          // response.data đã bị interceptor unwrap thành res trực tiếp
          const token = res?.token || res?.data?.token;
          const user = res?.user || res?.data?.user;

          if (!token) throw new Error('Không nhận được token từ server');

          // Lưu token vào localStorage để axiosClient interceptor tự gắn
          localStorage.setItem('token', token);

          set({ token, user, isLoading: false, error: null });
          return true;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.data?.message ||
            error?.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
          set({ isLoading: false, error: message, token: null, user: null });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, error: null });
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res: any = await axiosClient.post('/users/register', {
            fullName: name,
            email,
            password,
            role: 'Customer',
          });

          // Backend trả về token + user ngay khi đăng ký thành công
          const token = res?.token || res?.data?.token;
          const user  = res?.user  || res?.data?.user;

          if (token && user) {
            // Auto-login: lưu session ngay
            localStorage.setItem('token', token);
            set({ token, user, isLoading: false, error: null });
          } else {
            // Backend không trả token → chỉ thông báo thành công
            set({ isLoading: false, error: null });
          }

          return true;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.data?.message ||
            error?.message ||
            'Đăng ký thất bại. Email có thể đã được sử dụng.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // Chỉ persist token và user, không persist loading/error
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
