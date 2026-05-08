// 📁 components/editor/SymbolPicker.tsx
'use client'

import { X, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const symbols = [
  // 常用符号
  '•', '●', '○', '■', '□', '▶', '►', '→', '→', '←', '↑', '↓',
  // 特殊符号
  '★', '☆', '✓', '✔', '✗', '✘', '❗', '❓', '⚠️', '✅', '❌',
  // 箭头
  '⇨', '⇦', '⇧', '⇩', '↔', '↕',
  // 数学符号
  '±', '×', '÷', '≈', '≠', '≤', '≥',
  // 货币符号
  '$', '€', '£', '¥', '₹',
  // 其它
  '©', '®', '™', '℃', '℉'
]

interface SymbolPickerProps {
  onClose: () => void
}

export default function SymbolPicker({ onClose }: SymbolPickerProps) {
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null)

  const copyToClipboard = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol)
      setCopiedSymbol(symbol)
      toast.success(`已复制 ${symbol}`)
      setTimeout(() => setCopiedSymbol(null), 1000)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-background border border-border shadow-2xl rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Copy size={18} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground leading-tight">特殊符号</h3>
              <p className="text-xs text-muted-foreground">点击复制，粘贴即可使用</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="p-4 overflow-y-auto min-h-[300px]">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {symbols.map((symbol, index) => {
              const isCopied = copiedSymbol === symbol;
              return (
                <button
                  key={index}
                  onClick={() => copyToClipboard(symbol)}
                  className={cn(
                    "aspect-square flex items-center justify-center text-xl rounded-md border transition-all duration-200",
                    isCopied
                      ? "bg-green-500 text-white border-green-600 scale-110 shadow-lg"
                      : "bg-secondary/30 border-transparent hover:bg-secondary hover:border-border text-foreground hover:shadow-sm hover:-translate-y-0.5"
                  )}
                >
                  {isCopied ? <Check size={20} className="animate-in zoom-in spin-in-90 duration-300" /> : symbol}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-foreground text-background hover:opacity-90 rounded-lg text-sm font-medium transition-opacity"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}