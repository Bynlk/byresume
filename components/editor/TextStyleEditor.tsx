// 📁 components/editor/TextStyleEditor.tsx
'use client'

import { Bold, Italic, Underline, Highlighter, Heading1, Heading2, Heading3, Type, Palette } from 'lucide-react'
import { Button } from '../ui/Button'
import { useResumeStore } from '@/store/resumeStore'
import { useState } from 'react'
import SymbolPicker from './SymbolPicker'
import { cn } from '@/lib/utils'

export default function TextStyleEditor() {
  const { resumeData, updateStyles } = useResumeStore()

  // 安全访问 styles，提供默认值
  const styles = resumeData.styles || {
    fontFamily: 'Inter',
    fontSize: 14,
    bold: false,
    italic: false,
    underline: false,
    highlight: false,
    headings: {
      h1: { size: 24, weight: 'bold', color: '#1e293b' },
      h2: { size: 20, weight: 'semibold', color: '#334155' },
      h3: { size: 16, weight: 'medium', color: '#475569' }
    }
  }

  const [showSymbolPicker, setShowSymbolPicker] = useState(false)

  const toggleStyle = (style: keyof typeof styles) => {
    updateStyles({ [style]: !styles[style] })
  }

  const IconButton = ({
    active,
    onClick,
    icon: Icon,
    title,
    className
  }: {
    active?: boolean;
    onClick: () => void;
    icon: any;
    title: string;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md transition-all duration-200 flex items-center justify-center",
        "border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        active && "bg-primary text-primary-foreground border-primary shadow-inner",
        className
      )}
      title={title}
    >
      <Icon size={16} />
    </button>
  )

  return (
    <div className="px-3 py-2 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">

        {/* 左侧：常用样式 */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/50">
          <IconButton
            active={styles.bold}
            onClick={() => toggleStyle('bold')}
            icon={Bold}
            title="粗体"
          />
          <IconButton
            active={styles.italic}
            onClick={() => toggleStyle('italic')}
            icon={Italic}
            title="斜体"
          />
          <IconButton
            active={styles.underline}
            onClick={() => toggleStyle('underline')}
            icon={Underline}
            title="下划线"
          />
          <IconButton
            active={styles.highlight}
            onClick={() => toggleStyle('highlight')}
            icon={Highlighter}
            title="高亮标记"
          />
        </div>
        {/* 右侧：工具 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center h-8 bg-background border border-input rounded-md px-2 gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">字号</span>
            <select
              value={styles.fontSize}
              onChange={(e) => updateStyles({ fontSize: Number(e.target.value) })}
              className="bg-transparent text-sm w-12 focus:outline-none cursor-pointer"
            >
              {[12, 13, 14, 15, 16, 18].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>

          <IconButton
            onClick={() => setShowSymbolPicker(true)}
            icon={Type}
            title="插入符号"
          />
        </div>
      </div>

      {showSymbolPicker && (
        <SymbolPicker onClose={() => setShowSymbolPicker(false)} />
      )}
    </div>
  )
}