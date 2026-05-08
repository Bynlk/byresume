// 📁 ByResume/components/editor/ExperienceSection.tsx
'use client'

import { Briefcase, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InputGroup } from '../ui/InputGroup'
import RichTextEditor from '../ui/RichTextEditor'
import { useResumeStore } from '@/store/resumeStore'
import { Experience } from '@/types'

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

interface ExperienceSectionProps {
  data: Experience[]
  isExpanded: boolean
  onToggle: () => void
  dragHandleProps?: { attributes: DraggableAttributes; listeners: SyntheticListenerMap | undefined }
}

export default function ExperienceSection({ data, isExpanded, onToggle, dragHandleProps }: ExperienceSectionProps) {
  const { addExperience, updateExperience, removeExperience, reorderExperience, setSelectedContext } = useResumeStore()

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
        reorderExperience(arrayMove(data, oldIndex, newIndex))
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
              className="cursor-grab active:cursor-grabbing touch-none p-1.5 -ml-1 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
              title="拖动排序模块"
            >
              <GripVertical size={16} />
            </div>
          )}
          <span className="flex items-center text-sm font-bold text-foreground">
            <Briefcase size={14} className="mr-2" />
            工作经历 ({data.length})
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
              {data.map((exp, idx) => (
                <SortableItem key={exp.id} id={exp.id}>
                  {({ attributes, listeners, isDragging }) => (
                    <div
                      className={`mb-4 pb-4 border-b border-dashed border-border last:mb-0 last:border-0 group transition-all relative ${isDragging ? 'opacity-50 z-50 bg-muted rounded' : ''
                        } `}
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
                          onClick={() => removeExperience(exp.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputGroup
                        label="公司"
                        value={exp.company}
                        onChange={(value: string) => updateExperience(exp.id, { company: value })}
                        onFocus={() => setSelectedContext({ section: 'experience', itemId: exp.id, field: 'company', value: exp.company })}
                      />
                      <InputGroup
                        label="职位"
                        value={exp.position}
                        onChange={(value: string) => updateExperience(exp.id, { position: value })}
                        onFocus={() => setSelectedContext({ section: 'experience', itemId: exp.id, field: 'position', value: exp.position })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <InputGroup
                          label="开始时间"
                          value={exp.startDate}
                          onChange={(value: string) => updateExperience(exp.id, { startDate: value })}
                          onFocus={() => setSelectedContext({ section: 'experience', itemId: exp.id, field: 'startDate', value: exp.startDate })}
                        />
                        <InputGroup
                          label="结束时间"
                          value={exp.endDate}
                          onChange={(value: string) => updateExperience(exp.id, { endDate: value })}
                          onFocus={() => setSelectedContext({ section: 'experience', itemId: exp.id, field: 'endDate', value: exp.endDate })}
                        />
                      </div>
                      <div className="mt-2">
                        <RichTextEditor
                          label="工作内容"
                          value={exp.description}
                          onChange={(value: string) => updateExperience(exp.id, { description: value })}
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
            onClick={() => addExperience()}
          >
            添加经历
          </Button>
        </div>
      )}
    </div>
  )
}