// 📁 ByResume/components/ExportMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileJson, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'
import { useResumeStore } from '@/store/resumeStore'
import { toast } from 'sonner'
import { recordEvent } from '@/utils/eventTracker'

export default function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { resumeData } = useResumeStore()

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 模拟进度条
  const [progress, setProgress] = useState(0)

  const handleExportPdf = async () => {
    setIsOpen(false)
    setIsExporting(true)
    setProgress(10) // Start

    try {
      const fileName = `${resumeData.personalInfo.fullName || '简历'}_${new Date().toISOString().split('T')[0]}.pdf`

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90
          return prev + 5
        })
      }, 500)

      // 记录PDF导出事件
      recordEvent({
        type: 'pdf_export',
        timestamp: new Date().toISOString(),
        metadata: {
          templateId: resumeData.templateId || 'unknown',
          format: 'pdf_puppeteer',
          fileName: fileName,
        },
      });

      // 使用Puppeteer API生成PDF
      const response = await fetch('/byresume/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData }),
      })

      clearInterval(timer)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'PDF生成失败')
      }

      // 获取PDF blob
      const blob = await response.blob()
      setProgress(95)

      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setProgress(100)

      // Short delay to show 100%
      setTimeout(() => {
        toast.success('PDF 导出成功！')
        setIsExporting(false)
        setProgress(0)
      }, 500)

    } catch (error) {
      console.error('PDF 导出失败:', error)
      toast.error('PDF 导出失败，请重试')
      setIsExporting(false)
      setProgress(0)
    }
  }

  const handlePrint = () => {
    setIsOpen(false)
    window.print()
  }

  const handleExportJson = () => {
    setIsOpen(false)
    const dataStr = JSON.stringify(resumeData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resumeData.personalInfo.fullName || '简历'}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('JSON 数据导出成功！')
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="default"
        icon={isExporting ? Loader2 : Download}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={isExporting ? 'opacity-70' : ''}
      >
        {isExporting ? `导出中 ${progress}%` : '导出'}
      </Button>

      {/* 导出进度弹窗 */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-80 flex flex-col items-center border border-slate-200 dark:border-slate-700">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">正在生成 PDF...</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
              正在渲染矢量图形和字体，请稍候<br />(可能需要 10-15 秒)
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500 font-mono">{progress}%</div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
          <button
            onClick={handleExportPdf}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <FileText size={16} />
            导出 PDF
          </button>

          <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
          <button
            onClick={handleExportJson}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <FileJson size={16} />
            导出 JSON 数据
          </button>
        </div>
      )}
    </div>
  )
}
