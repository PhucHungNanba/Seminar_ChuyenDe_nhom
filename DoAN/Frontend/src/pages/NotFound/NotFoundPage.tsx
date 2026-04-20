import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, Pill } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

      {/* Animated pill illustration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Big glowing circle */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center shadow-xl shadow-sky-100">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Pill className="w-20 h-20 text-sky-400" strokeWidth={1.2} />
          </motion.div>
        </div>

        {/* Floating question mark */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-amber-400 text-white font-black text-xl flex items-center justify-center shadow-md"
        >
          ?
        </motion.div>
      </motion.div>

      {/* Error code */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-8xl font-black text-sky-200 select-none leading-none mb-2"
      >
        404
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-2xl font-bold text-slate-800 mb-2"
      >
        Không tìm thấy trang
      </motion.h1>

      {/* Sub-text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed"
      >
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors shadow-md shadow-sky-200 hover:shadow-lg"
        >
          <Home className="w-4 h-4" />
          Về Trang chủ
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-sky-300 hover:text-sky-600 transition-colors"
        >
          <Search className="w-4 h-4" />
          Tìm thuốc
        </Link>
      </motion.div>
    </div>
  )
}
