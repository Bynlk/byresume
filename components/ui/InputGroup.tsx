// 📁 ByResume/components/ui/InputGroup.tsx
import { TextareaHTMLAttributes, InputHTMLAttributes, useId } from 'react'

interface InputGroupProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  rows?: number
  type?: string
  onFocus?: () => void
  onClick?: () => void
  id?: string
}

export function InputGroup({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  className = '',
  rows = 4,
  type = 'text',
  onFocus,
  onClick,
  id: providedId,
}: InputGroupProps) {
  const generatedId = useId()
  const inputId = providedId || generatedId
  const baseClasses = "w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={inputId}
          className={`${baseClasses} min-h-[80px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onClick={onClick}
          placeholder={placeholder}
          rows={rows}
          aria-label={!label ? placeholder : undefined}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className={baseClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onClick={onClick}
          placeholder={placeholder}
          aria-label={!label ? placeholder : undefined}
        />
      )}
    </div>
  )
}