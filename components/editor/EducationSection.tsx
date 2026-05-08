// 📁 ByResume/components/editor/EducationSection.tsx
'use client'

import { GraduationCap, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InputGroup } from '@/components/ui/InputGroup'
import RichTextEditor from '../ui/RichTextEditor'
import { useResumeStore } from '@/store/resumeStore'
import { useState } from 'react'

// DnD Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableItem } from './SortableItem'

import { Education } from '@/types'

import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

interface EducationSectionProps {
  data: Education[]
  isExpanded: boolean
  onToggle: () => void
  dragHandleProps?: { attributes: DraggableAttributes; listeners: SyntheticListenerMap | undefined }
}

export default function EducationSection({ data, isExpanded, onToggle, dragHandleProps }: EducationSectionProps) {
  const { addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 10
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = data.findIndex(item => item.id === active.id)
      const newIndex = data.findIndex(item => item.id === over?.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderEducation(arrayMove(data, oldIndex, newIndex))
      }
    }
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
              className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 rounded-md text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 dark:hover:text-green-400 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
              title="拖动排序模块"
            >
              <GripVertical size={16} />
            </div>
          )}
          <span className="flex items-center text-sm font-bold text-foreground">
            <GraduationCap size={14} className="mr-2" />
            教育背景 ({data.length})
          </span>
        </div>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>

      {isExpanded && (
        <div className="p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={data.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.map((edu, idx) => (
                <SortableItem key={edu.id} id={edu.id}>
                  {({ attributes, listeners, isDragging }) => (
                    <div
                      className={`mb-4 pb-4 border-b border-dashed border-border last:mb-0 last:border-0 group transition-all relative ${isDragging ? 'opacity-50 z-50 bg-muted rounded' : ''
                        }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div
                          className="cursor-move p-1 text-muted-foreground hover:text-primary"
                          title="拖拽排序"
                          {...attributes}
                          {...listeners}
                        >
                          <GripVertical size={16} />
                        </div>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputGroup
                        label="学校"
                        value={edu.school}
                        onChange={(value: string) => updateEducation(edu.id, { school: value })}
                      />
                      <InputGroup
                        label="学位"
                        value={edu.degree}
                        onChange={(value: string) => updateEducation(edu.id, { degree: value })}
                      />
                      <InputGroup
                        label="专业"
                        value={edu.field || ''}
                        onChange={(value: string) => updateEducation(edu.id, { field: value })}
                        placeholder="如：计算机技术与巫术"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <InputGroup
                          label="开始时间"
                          value={edu.startDate}
                          onChange={(value: string) => updateEducation(edu.id, { startDate: value })}
                        />
                        <InputGroup
                          label="结束时间"
                          value={edu.endDate}
                          onChange={(value: string) => updateEducation(edu.id, { endDate: value })}
                        />
                      </div>

                      <div className="mt-2">
                        <RichTextEditor
                          label="描述"
                          value={edu.description || ''}
                          onChange={(value: string) => updateEducation(edu.id, { description: value })}
                        />
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

          <Button
            variant="ghost"
            className="w-full border border-dashed border-blue-200 text-blue-600 mt-2"
            icon={Plus}
            onClick={() => addEducation()}
          >
            添加学历
          </Button>
        </div>
      )}
    </div>
  )
}