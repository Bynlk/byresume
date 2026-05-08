// 📁 ByResume/components/AIAssistantPanel.tsx
'use client'

import { Bot, Send, Copy, Sparkles, Settings, Check, ChevronRight, ChevronLeft, RotateCcw, X, StopCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { useState, useEffect, useRef } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import AIConfigModal from './AIConfigModal'
import {
  AIConfig,
  getAIConfig,
  streamChat,
  ChatMessage
} from '@/lib/ai/aiService'
import { toast } from 'sonner'
import { recordEvent } from '@/utils/eventTracker'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface AIAssistantPanelProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export default function AIAssistantPanel({ isOpen, onToggle, className = '' }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: '你好！我是你的简历AI助手。我可以帮你优化简历内容、提供建议和检查错误。\n\n请先点击右上角设置按钮配置你的 AI API Key。' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { resumeData, selectedContext, loadFromLocalStorage } = useResumeStore()

  // 加载 AI 配置和聊天记录
  useEffect(() => {
    const config = getAIConfig()
    setAiConfig(config)

    // 确保从本地存储加载最新的简历数据
    loadFromLocalStorage()

    // 从本地存储加载聊天记录
    try {
      const saved = localStorage.getItem('ai-chat-history')
      if (saved) {
        const parsed = JSON.parse(saved)
        // 确保至少有一条消息（初始欢迎消息）
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch (error) {
      console.error('加载聊天记录失败:', error)
    }
  }, [loadFromLocalStorage])

  // 当 messages 变化时保存到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('ai-chat-history', JSON.stringify(messages))
    } catch (error) {
      console.error('保存聊天记录失败:', error)
    }
  }, [messages])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S 停止
      if (e.ctrlKey && e.key === 's' && isLoading) {
        e.preventDefault()
        handleStop()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoading])

  const handleSend = () => {
    handleSendWithInput(input)
  }

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      toast.success('已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
      toast.error('复制失败，请重试')
    }
  }

  const handleAnalyzeResume = () => {
    if (!aiConfig) {
      toast.error('请先配置 AI API Key')
      setShowConfigModal(true)
      return
    }
    const analyzeInput = '请分析我当前的简历，给出优化建议'
    setInput(analyzeInput)
    // 使用 setTimeout 确保 state 更新后再发送
    setTimeout(() => {
      handleSendWithInput(analyzeInput)
    }, 0)
  }

  const handleSendWithInput = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    if (!aiConfig) {
      toast.error('请先配置 AI API Key')
      setShowConfigModal(true)
      return
    }

    const userMessage: Message = { id: Date.now(), role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    recordEvent({
      type: 'ai_usage',
      timestamp: new Date().toISOString(),
      metadata: {
        action: 'chat_message',
        prompt: messageText.length > 100 ? messageText.substring(0, 100) + '...' : messageText,
        model: aiConfig.provider,
      },
    });

    const assistantMessageId = Date.now() + 1
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }])

    try {
      const chatMessages: ChatMessage[] = messages
        .filter(m => m.id !== 1)
        .map(m => ({ role: m.role, content: m.content }))
      chatMessages.push({ role: 'user', content: messageText })

      abortControllerRef.current = new AbortController()

      let fullContent = ''
      const stream = streamChat(chatMessages, resumeData, aiConfig, selectedContext, abortControllerRef.current.signal)

      for await (const chunk of stream) {
        fullContent += chunk
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: fullContent }
              : m
          )
        )
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const isUserInterrupted = errorMessage.includes('中断') || errorMessage.includes('aborted')

      if (!isUserInterrupted) {
        console.error('AI chat error:', error)
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: '抱歉，请求出错了。请检查你的 API 配置或稍后重试。' }
              : m
          )
        )
        toast.error('AI 请求失败')
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: '响应已停止。' }
              : m
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (isLoading) {
      setIsLoading(false)
      
      // 中断当前流
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = null
      
      toast.info('AI 响应已停止')
    }
  }

  const handleClearChat = () => {
    setMessages([
      { id: 1, role: 'assistant', content: '聊天记录已清空。有什么我可以帮你的吗？' }
    ])
    // 清除本地存储
    try {
      localStorage.removeItem('ai-chat-history')
    } catch (error) {
      console.error('清除本地存储失败:', error)
    }
    toast.success('聊天记录已清空')
  }

  const quickPrompts = [
    '优化工作经历',
    '检查语法错误',
    '优化技能表述',
    '改进个人简介',
    '生成摘要',
    '检查格式'
  ]

  return (
    <>
      {/* AI助手面板 - 使用固定布局结构 */}
      <div
        ref={panelRef}
        className={`flex flex-col h-full bg-background ${className}`}
      >
        {/* 头部 - 固定高度 */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between flex-shrink-0 bg-background">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-sm truncate">AI 助手</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${aiConfig ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span className="truncate">{aiConfig ? `${aiConfig.provider.toUpperCase()} 已连接` : '待配置'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted flex-shrink-0"
              title="清空聊天"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted flex-shrink-0"
              title="AI 配置"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* 快速提示 - 固定高度 */}
        <div className="px-3 py-2 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground truncate">快捷指令</p>
            <button
              onClick={handleAnalyzeResume}
              disabled={isLoading}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
            >
              <Sparkles size={11} />
              分析简历
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt)
                  inputRef.current?.focus()
                }}
                disabled={isLoading}
                className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md border border-border truncate max-w-[calc(50%-2px)] disabled:opacity-50"
                title={prompt}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* 聊天区域 - 可滚动，最大高度限制 */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2" style={{ 
          maxHeight: 'calc(100vh - 380px)',
          minHeight: '100px'
        }}>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-2.5 break-words ${message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none shadow-sm'
                  : 'bg-secondary text-secondary-foreground rounded-bl-none border border-border'
                  }`}
              >
                {message.role === 'assistant' ? (
                  <div className="text-xs leading-relaxed break-words markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-xs leading-relaxed break-words">{message.content}</div>
                )}
                {message.role === 'assistant' && message.content && (
                  <div className="mt-1.5 flex justify-end gap-1">
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="text-[10px] text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check size={9} /> 已复制
                        </>
                      ) : (
                        <>
                          <Copy size={9} /> 复制
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl rounded-bl-none p-2 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 - 固定在底部，始终可见 */}
        <div className="px-3 pb-2 pt-1 flex-shrink-0 bg-background border-t border-border">
          {/* 控制按钮区域 */}
          {isLoading && (
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  AI 思考中...
                </div>
                <div className="text-[10px] text-muted-foreground hidden sm:block">
                  Ctrl+S 停止
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleStop}
                  className="p-1 text-[10px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg hover:bg-red-100/50 dark:hover:bg-red-900/20 flex items-center gap-0.5"
                  title="停止 (Ctrl+S)"
                >
                  <StopCircle size={11} />
                  停止
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-1.5 items-stretch">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  // 自动调整高度
                  const textarea = e.target
                  textarea.style.height = 'auto'
                  const newHeight = Math.min(textarea.scrollHeight, 72) // 最大3行高度(约72px)
                  textarea.style.height = newHeight + 'px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="输入问题或指令..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none px-3 py-2 rounded-lg text-xs bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 text-foreground focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 disabled:opacity-50 placeholder:text-muted-foreground/60"
                style={{ minHeight: '36px', maxHeight: '72px' }}
              />
              {/* 浮动效果的阴影 */}
              <div className="absolute inset-0 rounded-lg shadow-sm pointer-events-none opacity-0 dark:opacity-100"></div>
            </div>
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 rounded-lg px-3 flex-shrink-0 min-w-[36px] max-h-[36px] h-auto flex items-center justify-center"
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* AI 配置弹窗 */}
      <AIConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onConfigured={(config) => {
          setAiConfig(config)
          toast.success('AI 配置已保存')
        }}
      />
    </>
  )
}