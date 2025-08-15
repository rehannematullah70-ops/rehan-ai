'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Moon, Sun, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function RehanAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m Rehan AI - your intelligent assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-xl border-b ${
        darkMode 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/20 border-black/10'
      } sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                rehan.ai
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Powered by GPT-5
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-all ${
              darkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-black/10 hover:bg-black/20 text-gray-900'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-140px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : darkMode
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20 text-white'
                  : 'bg-white/80 backdrop-blur-xl border border-black/10 text-gray-900'
              } rounded-2xl px-6 py-4 shadow-xl`}>
                <div className="flex items-start space-x-3">
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs ${
                        message.type === 'user' 
                          ? 'text-white/70' 
                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type === 'assistant' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className={`p-1 rounded transition-colors ${
                              darkMode 
                                ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                                : 'hover:bg-black/10 text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className={`p-1 rounded transition-colors ${
                            darkMode 
                              ? 'hover:bg-white/10 text-gray-400 hover:text-green-400' 
                              : 'hover:bg-black/10 text-gray-500 hover:text-green-600'
                          }`}>
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className={`p-1 rounded transition-colors ${
                            darkMode 
                              ? 'hover:bg-white/10 text-gray-400 hover:text-red-400' 
                              : 'hover:bg-black/10 text-gray-500 hover:text-red-600'
                          }`}>
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] ${
                darkMode
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                  : 'bg-white/80 backdrop-blur-xl border border-black/10'
              } rounded-2xl px-6 py-4 shadow-xl`}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-white' : 'bg-gray-900'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-white' : 'bg-gray-900'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-white' : 'bg-gray-900'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`backdrop-blur-xl rounded-2xl border p-4 ${
          darkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-black/10'
        } shadow-2xl`}>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className={`w-full resize-none border-none outline-none bg-transparent ${
                  darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                } text-sm leading-relaxed`}
                rows={1}
                style={{
                  minHeight: '24px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : darkMode
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}