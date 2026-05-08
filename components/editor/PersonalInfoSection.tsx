// 📁 components/editor/PersonalInfoSection.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, User, Plus, Trash2 } from 'lucide-react'
import { InputGroup } from '../ui/InputGroup'
import { useResumeStore } from '@/store/resumeStore'

interface PersonalInfoSectionProps {
  data: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    summary: string
    links: Array<{ platform: string; url: string }>
    customFields?: Array<{ id: string; label: string; value: string }>
  }
  isExpanded: boolean
  onToggle: () => void
}

export default function PersonalInfoSection({ data, isExpanded, onToggle }: PersonalInfoSectionProps) {
  const { updatePersonalInfo } = useResumeStore()
  const [newLinkUrl, setNewLinkUrl] = useState('')

  // 从URL提取平台名称（域名）
  const extractPlatformFromUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      return hostname.replace(/^www\./, '').split('.')[0]
    } catch {
      return ''
    }
  }

  const handleAddLink = () => {
    if (newLinkUrl.trim()) {
      const platform = extractPlatformFromUrl(newLinkUrl) || '链接'
      const updatedLinks = [...(data.links || []), { platform, url: newLinkUrl.trim() }]
      updatePersonalInfo({ links: updatedLinks })
      setNewLinkUrl('')
    }
  }

  const handleRemoveLink = (index: number) => {
    const updatedLinks = (data.links || []).filter((_, i) => i !== index)
    updatePersonalInfo({ links: updatedLinks })
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* 标题栏 */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">个人信息</h3>
            <p className="text-xs text-muted-foreground">
              {data.name || '未填写'}
            </p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <InputGroup
            label="姓名"
            value={data.name}
            onChange={(value) => updatePersonalInfo({ name: value, fullName: value })}
            placeholder="你的姓名"
          />

          <InputGroup
            label="职位"
            value={data.title}
            onChange={(value) => updatePersonalInfo({ title: value })}
            placeholder="期望职位"
          />

          <InputGroup
            label="邮箱"
            value={data.email}
            onChange={(value) => updatePersonalInfo({ email: value })}
            placeholder="邮箱地址"
            type="email"
          />

          <InputGroup
            label="电话"
            value={data.phone}
            onChange={(value) => updatePersonalInfo({ phone: value })}
            placeholder="联系电话"
            type="tel"
          />

          <InputGroup
            label="地址"
            value={data.location}
            onChange={(value) => updatePersonalInfo({ location: value })}
            placeholder="所在城市"
          />

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              个人简介
            </label>
            <textarea
              value={data.summary}
              onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              placeholder="个人简介、职业目标等..."
              className="w-full min-h-[80px] p-3 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* 链接 */}
          <div className="space-y-2 mb-3">
            {(data.links || []).map((link, index) => (
              <div key={index} className="flex flex-wrap gap-2 items-center">
                {/* 链接输入框：只显示URL，平台自动从URL提取 */}
                <input
                  value={link.url}
                  onChange={(e) => {
                    const newUrl = e.target.value
                    const newPlatform = extractPlatformFromUrl(newUrl) || link.platform
                    const newLinks = [...(data.links || [])]
                    newLinks[index] = { platform: newPlatform, url: newUrl }
                    updatePersonalInfo({ links: newLinks })
                  }}
                  placeholder="https://example.com"
                  className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-border rounded bg-background text-foreground"
                />
                
                {/* 删除按钮：保持不收缩 */}
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="p-1.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-nowrap gap-2">
            <input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              placeholder="输入链接地址"
              className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-border rounded bg-background text-foreground"
            />
            <button
              onClick={handleAddLink}
              className="px-3 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <Plus size={14} />
              
            </button>
          </div>
        </div>
      )}
    </div>
  )
}