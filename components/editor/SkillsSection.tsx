// 📁 ByResume/components/editor/SkillsSection.tsx
'use client'

import { Check, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useResumeStore } from '@/store/resumeStore'
import { useState } from 'react'
import { Skill } from '@/types'

import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

interface SkillsSectionProps {
  data: Skill[]
  isExpanded: boolean
  onToggle: () => void
  dragHandleProps?: { attributes: DraggableAttributes; listeners: SyntheticListenerMap | undefined }
}

export default function SkillsSection({ data, isExpanded, onToggle, dragHandleProps }: SkillsSectionProps) {
  const { updateSkills } = useResumeStore()
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      // Add as object with ID for future DnD support
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: 3
      }
      updateSkills([...data, skill])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    const newSkills = data.filter((_, i) => i !== index)
    updateSkills(newSkills)
  }

  return (
    <div className="border rounded-lg overflow-hidden border-border bg-card">
      <div
        className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-muted cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <div
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 rounded-md text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 dark:hover:text-purple-400 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
              title="拖动排序模块"
            >
              <GripVertical size={16} suppressHydrationWarning />
            </div>
          )}
          <span className="flex items-center text-sm font-bold text-foreground">
            <Check size={14} className="mr-2" suppressHydrationWarning />
            专业技能 ({data.length})
          </span>
        </div>
        {isExpanded ? <ChevronUp size={14} suppressHydrationWarning /> : <ChevronDown size={14} suppressHydrationWarning />}
      </div>

      {isExpanded && (
        <div className="p-3 bg-card">
          <div className="flex flex-wrap gap-2 mb-4">
            {data.map((skill, idx) => (
              <div
                key={skill.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill.name}
                <button
                  onClick={() => handleRemoveSkill(idx)}
                  className="ml-1 text-primary/60 hover:text-destructive"
                >
                  <Trash2 size={12} suppressHydrationWarning />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="输入技能，按回车添加"
              className="flex-1 px-3 py-1 border border-border rounded text-sm bg-background text-foreground"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleAddSkill}
              icon={Plus}
              disabled={!newSkill.trim()}
            />
          </div>
        </div>
      )}
    </div>
  )
}