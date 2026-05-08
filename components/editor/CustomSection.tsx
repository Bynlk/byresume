// 📁 components/editor/CustomSection.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, Palette, GripVertical, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { useResumeStore } from '@/store/resumeStore'

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
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

type CustomSection = { id: string; title: string; content: string }

interface CustomSectionProps {
  data: CustomSection[]
  isExpanded: boolean
  onToggle: () => void
  dragHandleProps?: { attributes: DraggableAttributes; listeners: SyntheticListenerMap | undefined }
}

export default function CustomSection({ data, isExpanded, onToggle, dragHandleProps }: CustomSectionProps) {
  const { addCustomSection, updateCustomSection, removeCustomSection, reorderCustomSections } = useResumeStore()

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
        reorderCustomSections(arrayMove(data, oldIndex, newIndex))
      }
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* 标题栏 */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {dragHandleProps && (
            <div
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
              title="拖动排序模块"
            >
              <GripVertical size={16} />
            </div>
          )}
          <div>
            <Palette size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">自定义模块</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {data.length} 个模块
            </p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
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
              {data.map((section) => (
                <SortableItem key={section.id} id={section.id}>
                  {({ attributes, listeners, isDragging }) => (
                    <div
                      className={`p-3 border border-border rounded-lg space-y-2 relative ${isDragging ? 'opacity-50 z-50 bg-muted' : ''
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="cursor-move p-1 text-muted-foreground hover:text-primary"
                            title="拖拽排序"
                            {...attributes}
                            {...listeners}
                          >
                            <GripVertical size={16} />
                          </div>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                            placeholder="模块标题"
                            className="w-full p-2 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          />
                        </div>

                        <button
                          onClick={() => removeCustomSection(section.id)}
                          className="p-1 text-muted-foreground hover:text-destructive ml-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <textarea
                        value={section.content}
                        onChange={(e) => updateCustomSection(section.id, { content: e.target.value })}
                        placeholder="模块内容描述..."
                        className="w-full min-h-[80px] p-2 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

          <Button
            onClick={addCustomSection}
            variant="outline"
            className="w-full border-dashed border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600"
          >
            <Plus size={16} className="mr-2" />
            添加自定义模块
          </Button>
        </div>
      )}
    </div>
  )
}