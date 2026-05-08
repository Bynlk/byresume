import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode } from 'react'

interface RenderProps {
    attributes: any
    listeners: any
    isDragging: boolean
}

interface SortableItemProps {
    id: string
    children: ReactNode | ((props: RenderProps) => ReactNode)
    className?: string
}

// Helper to filter out aria-describedby to avoid hydration mismatch
function filterAttributes(attributes: any) {
    // Always remove aria-describedby to prevent hydration mismatch
    const { 'aria-describedby': _, ...rest } = attributes
    return rest
}

export function SortableItem({ id, children, className }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const filteredAttributes = filterAttributes(attributes)

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
        position: 'relative' as const,
        touchAction: 'pan-y'  // 允许垂直滚动，同时支持拖拽
    }

    // Check if children is a function (render prop pattern)
    if (typeof children === 'function') {
        return (
            <div ref={setNodeRef} style={style} className={className}>
                {(children as (props: RenderProps) => ReactNode)({
                    attributes: filteredAttributes,
                    listeners,
                    isDragging
                })}
            </div>
        )
    }

    // Default behavior: The whole item is the drag handle
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={className}
            {...filteredAttributes}
            {...listeners}
        >
            {children}
        </div>
    )
}
