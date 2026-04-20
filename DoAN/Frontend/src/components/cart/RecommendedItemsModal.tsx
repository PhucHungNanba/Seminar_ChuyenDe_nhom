import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { getRulesForProducts } from '../../data/mockAssociationRules'
import { getMedicineById } from '../../data/allProducts'
import { Link } from 'react-router-dom'

export default function RecommendedItemsModal() {
  const latestAddedItemId = useCartStore(s => s.latestAddedItemId)
  const clearLatestAddedItem = useCartStore(s => s.clearLatestAddedItem)
  const addItem = useCartStore(s => s.addItem)
  
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (latestAddedItemId) {
      const addedItem = getMedicineById(latestAddedItemId)
      if (addedItem) {
        // use association rules to find recommendations
        const rules = getRulesForProducts([latestAddedItemId])
        let recommendedIds = rules.map(r => r.consequent.id)
        // filter out duplicates and the item itself
        recommendedIds = Array.from(new Set(recommendedIds)).filter(id => id !== latestAddedItemId)
        
        const recs = recommendedIds.map(id => getMedicineById(id)).filter(Boolean)
        setRecommendations(recs)
      }
    }
  }, [latestAddedItemId])

  if (!latestAddedItemId || recommendations.length === 0) return null

  function handleAddRec(rec: any) {
    addItem({
      id: rec.id,
      name: rec.name,
      type: rec.type,
      price: rec.price,
      quantity: 1,
      imageUrl: rec.imageUrl
    })
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={clearLatestAddedItem}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Sản phẩm thường được mua kèm</h2>
            <p className="text-sm text-gray-500 mt-1">Nhiều khách hàng đã mua thêm các sản phẩm này</p>
          </div>
          <button onClick={clearLatestAddedItem} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map(rec => (
              <div key={rec.id} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors bg-gray-50/50">
                <div className="w-20 h-20 bg-white rounded-lg p-2 border border-gray-100 shrink-0">
                  <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <Link to={`/products/${rec.id}`} onClick={clearLatestAddedItem} className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                    {rec.name}
                  </Link>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-bold text-blue-700">{rec.price.toLocaleString('vi-VN')}đ</span>
                    <button
                      onClick={() => handleAddRec(rec)}
                      disabled={rec.type === 'rx'}
                      className={`p-1.5 rounded-full ${rec.type === 'rx' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors'}`}
                      title={rec.type === 'rx' ? 'Thuốc kê đơn không thể mua nhanh' : 'Thêm vào giỏ'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={clearLatestAddedItem} className="px-6 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
            Bỏ qua
          </button>
          <Link to="/cart" onClick={clearLatestAddedItem} className="px-6 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Đi đến giỏ hàng
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
