// 📁 ByResume/components/TemplatePicker.tsx
'use client'

import { useState } from 'react'
import { Palette, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'

interface TemplatePickerProps {
  currentTemplate: string
  currentColor: string
  onTemplateChange: (templateId: string) => void
  onColorChange: (color: string) => void
}

const TEMPLATES = [
  { id: 'tpl-1', name: '现代简约', layout: 'modern', color: 'blue' },
  { id: 'tpl-2', name: '经典商务', layout: 'classic', color: 'blue' },
  { id: 'tpl-3', name: '极简主义', layout: 'minimal', color: 'blue' },
  { id: 'tpl-5', name: '创意艺术', layout: 'creative', color: 'blue' },
  { id: 'tpl-9', name: '科技感', layout: 'tech', color: 'blue' },
  { id: 'tpl-10', name: '优雅典雅', layout: 'elegant', color: 'amber' },
  { id: 'tpl-11', name: '专业商务', layout: 'professional', color: 'blue' },
  { id: 'tpl-12', name: '现代极简', layout: 'modernminimal', color: 'gray' },
]


export default function TemplatePicker({
  currentTemplate,
  currentColor,
  onTemplateChange,
  onColorChange,
}: TemplatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentTemplateObj = TEMPLATES.find(t => t.id === currentTemplate) || TEMPLATES[0]

  return (
    <div className="relative">
      <Button
        variant="secondary"
        icon={Palette}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hidden lg:inline" suppressHydrationWarning>{currentTemplateObj.name}</span>
        <ChevronDown size={14} className="ml-1" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-card rounded-lg shadow-xl border border-border z-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                选择模板
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-4 max-h-60 overflow-y-auto">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onTemplateChange(template.id)
                      onColorChange(template.color)
                      setIsOpen(false)
                    }}
                    className={`p-2 rounded border text-xs ${currentTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border hover:bg-muted'
                      }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  )
}