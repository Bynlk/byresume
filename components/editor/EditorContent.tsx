// 📁 components/editor/EditorContent.tsx
'use client'

import { ResumeData } from '@/types'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DraggableAttributes } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { SortableItem } from './SortableItem'
import PersonalInfoSection from './PersonalInfoSection'
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'
import SkillsSection from './SkillsSection'
import ProjectsSection from './ProjectsSection'
import CustomSection from './CustomSection'

interface EditorContentProps {
  /** 简历数据 */
  resumeData: ResumeData
  /** 展开状态的区域集合 */
  expandedSections: Record<string, boolean>
  /** 切换区域展开/折叠 */
  onToggleSection: (section: string) => void
  /** 拖拽结束回调 */
  onDragEnd: (event: DragEndEvent) => void
}

/**
 * 编辑器内容组件
 * 包含可拖拽排序的简历编辑区域
 */
export default function EditorContent({
  resumeData,
  expandedSections,
  onToggleSection,
  onDragEnd,
}: EditorContentProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const sectionOrder = resumeData.sectionOrder || ['personal', 'experience', 'education', 'skills', 'projects', 'custom']

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        {sectionOrder.map((sectionKey) => (
          <SortableItem key={sectionKey} id={sectionKey}>
            {({ attributes, listeners, isDragging }) => (
              <div className={`${isDragging ? 'opacity-50 z-50' : ''}`}>
                <SectionRenderer
                  sectionKey={sectionKey}
                  resumeData={resumeData}
                  expandedSections={expandedSections}
                  onToggleSection={onToggleSection}
                  dragHandleProps={{ attributes, listeners }}
                />
              </div>
            )}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}

interface SectionRendererProps {
  sectionKey: string
  resumeData: ResumeData
  expandedSections: Record<string, boolean>
  onToggleSection: (section: string) => void
  dragHandleProps: {
    attributes: DraggableAttributes
    listeners: SyntheticListenerMap | undefined
  }
}

/**
 * 区域渲染器
 * 根据 sectionKey 渲染对应的编辑区域
 */
function SectionRenderer({ sectionKey, resumeData, expandedSections, onToggleSection, dragHandleProps }: SectionRendererProps) {
  const sectionProps = {
    isExpanded: expandedSections[sectionKey] ?? true,
    onToggle: () => onToggleSection(sectionKey),
    dragHandleProps,
  }

  switch (sectionKey) {
    case 'personal':
      return <PersonalInfoSection data={resumeData.personalInfo} isExpanded={sectionProps.isExpanded} onToggle={sectionProps.onToggle} />
    case 'experience':
      return <ExperienceSection data={resumeData.experience} {...sectionProps} />
    case 'education':
      return <EducationSection data={resumeData.education} {...sectionProps} />
    case 'skills':
      return <SkillsSection data={resumeData.skills} {...sectionProps} />
    case 'projects':
      return <ProjectsSection data={resumeData.projects} {...sectionProps} />
    case 'custom':
      return <CustomSection data={resumeData.customSections} {...sectionProps} />
    default:
      return null
  }
}
