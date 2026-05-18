import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useCartStore } from './store/cartStore'
import MainLayout from './components/layout/MainLayout'
import CartPage from './pages/Cart/CartPage'
import MedicineDetailPage from './pages/MedicineDetail/MedicineDetailPage'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import OrderTrackingPage from './pages/OrderTracking/OrderTrackingPage'
import HomePage from './pages/Home/HomePage'
import ProductsPage from './pages/Products/ProductsPage'
import UserProfilePage from './pages/Profile/UserProfilePage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import AuthPage from './pages/Auth/AuthPage'
import OrdersListPage from './pages/Orders/OrdersListPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}


export default function App() {
  // Cleanup persisted blob: URLs from previous sessions (blob URLs are not valid after reload)
  useEffect(() => {
    const { items, setPrescription } = useCartStore.getState()
    items.forEach((it) => {
      if (it.prescription && typeof it.prescription.fileUrl === 'string' && it.prescription.fileUrl.startsWith('blob:')) {
        setPrescription(it.id, null)
      }
    })
  }, [])
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><UserProfilePage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
        <Route path="/orders" element={<MainLayout><OrdersListPage /></MainLayout>} />
        <Route path="/orders/:id" element={<MainLayout><OrderTrackingPage /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><MedicineDetailPage /></MainLayout>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
