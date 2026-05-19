import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Pill, Phone, Mail, MapPin, Share2, PlayCircle } from 'lucide-react'
import Navbar from './Navbar'
import RecommendedItemsModal from '../cart/RecommendedItemsModal'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── Page content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-black">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900 text-lg">
                  PharmaCare
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Hệ thống mua thuốc & giao thuốc trực tuyến uy tín, an toàn, đáng tin cậy.
              </p>
              <div className="flex gap-3 mt-1">
                <a href="#" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
                  <PlayCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-slate-900 font-semibold mb-3 text-sm">Danh mục</h3>
              <ul className="flex flex-col gap-2 text-sm">
                {['Thuốc OTC', 'Thuốc Rx (kê đơn)', 'Vitamin & TPCN', 'Chăm sóc cá nhân', 'Thiết bị y tế'].map((t) => (
                  <li key={t}>
                    <Link to="/products" className="hover:text-black transition-colors">{t}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-slate-900 font-semibold mb-3 text-sm">Hỗ trợ</h3>
              <ul className="flex flex-col gap-2 text-sm">
                {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Tra cứu đơn hàng', 'Chính sách bảo mật', 'Điều khoản sử dụng'].map((t) => (
                  <li key={t}>
                    <a href="#" className="hover:text-black transition-colors">{t}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-slate-900 font-semibold mb-3 text-sm">Liên hệ</h3>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>1800 6789 (Miễn phí)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>hotro@pharmacare.vn</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>123 Nguyễn Trãi, Quận 1, TP.HCM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-100 mt-8 pt-5 flex flex-col sm:flex-row
                          items-center justify-between gap-2 text-xs text-slate-400">
            <p>© 2025 PharmaCare. Bản quyền thuộc về PharmaCare Vietnam.</p>
            <p className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
              Giấy phép DKKD: 0123456789
            </p>
          </div>
        </div>
      </footer>
      
      {/* ── Cross-sell Modal ── */}
      <RecommendedItemsModal />
    </div>
  )
}
