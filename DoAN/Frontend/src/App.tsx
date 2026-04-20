import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import MainLayout from './components/layout/MainLayout'
import CartPage from './pages/Cart/CartPage'
import MedicineDetailPage from './pages/MedicineDetail/MedicineDetailPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrderTrackingPage from './pages/OrderTracking/OrderTrackingPage'
import HomePage from './pages/Home/HomePage'
import ProductsPage from './pages/Products/ProductsPage'
import UserProfilePage from './pages/Profile/UserProfilePage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import { useCartStore } from './store/cartStore'
import AuthPage from './pages/Auth/AuthPage'
import OrdersListPage from './pages/Orders/OrdersListPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// ── Seed mock cart on first load ─────────────────────
function MockCartSeeder() {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)

  useEffect(() => {
    if (items.length > 0) return // already seeded
    addItem({
      id: 'otc-001',
      name: 'Paracetamol 500mg',
      type: 'otc',
      price: 25000,
      quantity: 2,
      imageUrl: 'https://placehold.co/80x80/e0f2fe/0ea5e9?text=OTC',
    })
    addItem({
      id: 'rx-001',
      name: 'Amoxicillin 500mg',
      type: 'rx',
      price: 85000,
      quantity: 1,
      imageUrl: 'https://placehold.co/80x80/fef3c7/f59e0b?text=Rx',
    })
    addItem({
      id: 'otc-002',
      name: 'Vitamin C 1000mg',
      type: 'otc',
      price: 45000,
      quantity: 1,
      imageUrl: 'https://placehold.co/80x80/d1fae5/10b981?text=OTC',
    })
    addItem({
      id: 'rx-002',
      name: 'Metformin 850mg',
      type: 'rx',
      price: 120000,
      quantity: 2,
      imageUrl: 'https://placehold.co/80x80/fef3c7/f59e0b?text=Rx',
    })
  }, [])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MockCartSeeder />
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><UserProfilePage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
        <Route path="/orders" element={<MainLayout><OrdersListPage /></MainLayout>} />
        <Route path="/orders/:id" element={<MainLayout><OrderTrackingPage /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><MedicineDetailPage /></MainLayout>} />
        <Route path="/auth" element={<MainLayout><AuthPage /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
