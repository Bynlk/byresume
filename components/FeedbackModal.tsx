// 📁 ByResume/components/FeedbackModal.tsx
'use client'

import { useState } from 'react'
import { X, Send, Star, Bug, Zap, Lightbulb, HelpCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { toast } from 'sonner'

const BASE_PATH = '/byresume'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userEmail?: string
}

const FEEDBACK_TYPES = [
  { id: 'bug', label: 'Bug 报告', icon: <Bug size={16} />, description: '发现了错误或问题' },
  { id: 'feature', label: '功能建议', icon: <Zap size={16} />, description: '希望添加新功能' },
  { id: 'suggestion', label: '改进建议', icon: <Lightbulb size={16} />, description: '现有功能优化建议' },
  { id: 'other', label: '其他反馈', icon: <HelpCircle size={16} />, description: '其他类型的反馈' },
]

export default function FeedbackModal({ isOpen, onClose, userId, userEmail }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'suggestion',
    title: '',
    content: '',
    rating: 0,
    email: userEmail || '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('请填写标题和内容')
      return
    }

    if (formData.content.length < 10) {
      toast.error('反馈内容至少需要10个字符')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${BASE_PATH}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId || null,
          email: formData.email || null,
          type: formData.type,
          title: formData.title,
          content: formData.content,
          rating: formData.rating > 0 ? formData.rating : null,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('反馈提交成功！感谢您的宝贵意见。')
        setFormData({
          type: 'suggestion',
          title: '',
          content: '',
          rating: 0,
          email: userEmail || '',
        })
        onClose()
      } else {
        toast.error(data.error || '提交失败，请稍后重试')
      }
    } catch (error) {
      console.error('提交反馈时出错:', error)
      toast.error('网络错误，请检查连接后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">提交反馈</h2>
              <p className="text-sm text-muted-foreground mt-1">
                您的意见将帮助我们改进产品
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 反馈类型 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              反馈类型
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FEEDBACK_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleChange('type', type.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.type === type.id
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary/50 border-border text-secondary-foreground hover:bg-secondary'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  <span className="text-xs opacity-75">{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 评分（可选） */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              总体评分（可选）
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={28}
                    className={star <= formData.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-muted-foreground'
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating > 0 ? `${formData.rating} 星` : '点击评分'}
              </span>
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="简要描述您的反馈"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              maxLength={100}
            />
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              详细内容 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="请详细描述您的反馈，包括具体场景、期望结果等..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
              minLength={10}
              maxLength={2000}
            />
            <div className="mt-1 text-xs text-muted-foreground text-right">
              {formData.content.length}/2000
            </div>
          </div>

          {/* 邮箱（可选） */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              联系邮箱（可选，用于回复反馈）
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 提交按钮 */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                取消
              </button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    提交反馈
                  </>
                )}
              </Button>
            </div>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              我们承诺认真阅读每一条反馈，并尽快处理
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}