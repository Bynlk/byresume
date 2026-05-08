// 📁 ByResume/components/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText, Moon, Sun, PanelLeft, Upload, MessageSquare } from 'lucide-react'
import { Button } from './ui/Button'
import TemplatePicker from './TemplatePicker'
import ExportMenu from './ExportMenu'
import { useResumeStore } from '@/store/resumeStore'
import { ResumeData } from '@/types'
import { toast } from 'sonner'

interface HeaderProps {
  theme: string | undefined
  onThemeChange: (theme: string) => void
  onPrint: () => void
  onToggleSidebar: () => void
  onOpenFeedback?: () => void
}

const THEME_COLORS: Record<string, string> = {
  blue: '221.2 83.2% 53.3%', // blue-600
  emerald: '160 84% 39%', // emerald-600
  violet: '262.1 83.3% 57.8%', // violet-600
  slate: '222.2 47.4% 11.2%', // slate-900
}

export default function Header({
  theme,
  onThemeChange,
  onPrint,
  onToggleSidebar,
  onOpenFeedback,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { resumeData, setResumeData, updateTemplate, updateThemeColor } = useResumeStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 监听主题颜色变化并更新 CSS 变量
  useEffect(() => {
    const color = resumeData.themeColor || 'blue'
    const hsl = THEME_COLORS[color]
    if (hsl) {
      document.documentElement.style.setProperty('--primary', hsl)
      document.documentElement.style.setProperty('--ring', hsl)
    }
  }, [resumeData.themeColor])

  const handleTemplateChange = (templateId: string) => {
    updateTemplate(templateId)
  }

  const handleColorChange = (color: string) => {
    updateThemeColor(color)
  }

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ResumeData
        // 验证数据结构
        if (data.personalInfo && data.experience && data.education && data.skills) {
          setResumeData(data)
          toast.success('简历数据导入成功！')
        } else {
          toast.error('JSON 文件格式不正确')
        }
      } catch {
        toast.error('无法解析 JSON 文件')
      }
    }
    reader.readAsText(file)
    // 重置 input 以允许重复导入同一文件
    event.target.value = ''
  }

  return (
    <header className="h-16 bg-background border-b border-border fixed w-full top-0 z-50 flex items-center justify-between px-4 print:hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <FileText size={20} />
          </div>
          <span className="font-bold text-lg hidden md:block text-foreground">
            ByResume
          </span>
        </div>

        <TemplatePicker
          currentTemplate={resumeData.templateId || 'tpl-1'}
          currentColor={resumeData.themeColor || 'blue'}
          onTemplateChange={handleTemplateChange}
          onColorChange={handleColorChange}
        />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* 隐藏的文件输入 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportJson}
          accept=".json"
          className="hidden"
        />

        {/* 导入按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          title="导入 JSON 数据"
          className="hidden md:flex"
        >
          <Upload size={18} />
        </Button>

        {/* 反馈按钮 */}
        {onOpenFeedback && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenFeedback}
            title="提交反馈"
            className="hidden md:flex"
          >
            <MessageSquare size={18} />
          </Button>
        )}

        {/* 主题切换 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          title={mounted ? (theme === 'light' ? '切换到深色模式' : '切换到浅色模式') : '切换主题'}
        >
          {mounted ? (theme === 'light' ? <Moon size={18} /> : <Sun size={18} />) : <Sun size={18} />}
        </Button>

        {/* 导出菜单 */}
        <ExportMenu />
      </div>
    </header>
  )
}