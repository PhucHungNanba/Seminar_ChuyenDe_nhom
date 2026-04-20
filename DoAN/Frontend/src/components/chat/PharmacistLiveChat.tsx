import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Bot } from 'lucide-react'

export default function PharmacistLiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([
    { id: '1', text: 'Chào bạn, tôi là Dược sĩ PharmaCare. Tôi có thể giúp gì cho bạn hôm nay?', sender: 'bot' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'bot' | 'live'>('bot')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const QUICK_REPLIES = ['Tôi cần tư vấn dùng thuốc', 'Tra cứu liều lượng', 'Theo dõi đơn hàng']

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  function handleSend(text: string) {
    if (!text.trim()) return
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'user' }])
    
    if (text === 'Tôi cần tư vấn dùng thuốc') {
      setIsTyping(true)
      setTimeout(() => {
        setMode('live')
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Đang kết nối với Dược sĩ Nguyễn Văn A...', sender: 'bot' }])
        setIsTyping(false)
        
        // Mock actual pharmacist reply
        setTimeout(() => {
          setIsTyping(true)
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Chào bạn, tôi là Dược sĩ Nguyễn Văn A. Bạn đang gặp triệu chứng gì cần tư vấn ạ?', sender: 'bot' }])
            setIsTyping(false)
          }, 1500)
        }, 1000)
      }, 1000)
    } else {
      // Mock other responses
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Hiện tại hệ thống đang xử lý yêu cầu của bạn. Vui lòng chờ trong giây lát...', sender: 'bot' }])
        setIsTyping(false)
      }, 1000)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            {/* Header */}
            <div className={`p-4 text-white flex items-center justify-between ${mode === 'live' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {mode === 'live' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold leading-tight">{mode === 'live' ? 'Dược sĩ Nguyễn Văn A' : 'Trợ lý PharmaCare'}</h3>
                  <p className="text-xs text-blue-100 mt-0.5">{mode === 'live' ? 'Trực tuyến' : 'Tự động'}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Gợi ý:</p>
                  {QUICK_REPLIES.map(reply => (
                    <button
                      key={reply}
                      onClick={() => handleSend(reply)}
                      className="text-left text-sm bg-white border border-blue-100 text-blue-700 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const input = form.elements.namedItem('message') as HTMLInputElement
                  handleSend(input.value)
                  input.value = ''
                }}
                className="flex items-center gap-2"
              >
                <input
                  name="message"
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  autoComplete="off"
                />
                <button type="submit" className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
