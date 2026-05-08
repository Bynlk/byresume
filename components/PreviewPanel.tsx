// 📁 ByResume/components/PreviewPanel.tsx
'use client'

import { useResumeStore } from '@/store/resumeStore'
import TemplateEngine from '@/lib/resume/TemplateEngine'
import { useEffect, useState, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react'

export default function PreviewPanel() {
  const { resumeData } = useResumeStore()
  const [scale, setScale] = useState(1)
  const [exportReady, setExportReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const paperContainerRef = useRef<HTMLDivElement>(null)

  /* Removed automatic scale calculation to default to fit width initially or 1, now managed by controls */
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const targetWidth = 794
    const availableWidth = containerWidth - 32
    return availableWidth < targetWidth ? availableWidth / targetWidth : 1
  }, [])

  // Initialize scale
  useEffect(() => {
    const initialScale = calculateScale()
    if (initialScale) setScale(initialScale)
  }, [calculateScale])

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5))
  const handleFitWidth = () => {
    const newScale = calculateScale()
    if (newScale) setScale(newScale)
  }
  const handleReset = () => setScale(1)

  useEffect(() => {
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [calculateScale])

  // 在导出前准备元素
  const prepareForExport = useCallback(() => {
    if (paperContainerRef.current) {
      // 临时禁用缩放
      paperContainerRef.current.style.transform = 'none'
      paperContainerRef.current.style.transformOrigin = 'top left'
      paperContainerRef.current.style.marginBottom = '0'
      setExportReady(true)
    }
  }, [])

  // 导出后恢复
  const restoreAfterExport = useCallback(() => {
    if (paperContainerRef.current) {
      // 重新应用缩放
      paperContainerRef.current.style.transform = `scale(${scale})`
      paperContainerRef.current.style.transformOrigin = 'top center'
      paperContainerRef.current.style.marginBottom = `calc(-297mm * (1 - ${scale}))`
      setExportReady(false)
    }
  }, [scale])

  const styles = resumeData.styles || {
    fontFamily: 'Inter',
    fontSize: 14,
    bold: false,
    italic: false,
    underline: false,
    highlight: false,
    headings: {
      h1: { size: 24, weight: 'bold', color: '#1e293b' },
      h2: { size: 20, weight: 'semibold', color: '#334155' },
      h3: { size: 16, weight: 'medium', color: '#475569' }
    }
  }

  // 导出函数供外部调用
  useEffect(() => {
    // 扩展Window接口以包含我们的函数
    interface WindowWithExportFunctions extends Window {
      __prepareResumeForExport?: () => void
      __restoreResumeAfterExport?: () => void
      __isResumeExportReady?: () => boolean
    }

    const win = window as WindowWithExportFunctions
    win.__prepareResumeForExport = prepareForExport
    win.__restoreResumeAfterExport = restoreAfterExport
    win.__isResumeExportReady = () => exportReady

    return () => {
      delete win.__prepareResumeForExport
      delete win.__restoreResumeAfterExport
      delete win.__isResumeExportReady
    }
  }, [prepareForExport, restoreAfterExport, exportReady])

  return (
    // 外层容器：负责滚动，占据所有剩余空间
    <div
      className="flex-1 h-full overflow-y-auto bg-slate-100/50 scroll-smooth custom-scrollbar relative"
    >
      {/* 缩放计算容器：用于获取可用宽度 */}
      <div ref={containerRef} className="min-h-full w-full flex justify-center py-8 relative">

        {/* 缩放控制栏 */}
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-lg border border-border p-1.5 rounded-full z-50 transition-opacity hover:opacity-100 opacity-80">
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground" title="缩小">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground" title="放大">
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={handleFitWidth} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground" title="适应宽度">
            <Maximize size={16} />
          </button>
          <button onClick={handleReset} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground" title="重置 100%">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* 简历纸张容器：应用缩放 */}
        <div
          ref={paperContainerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            // 缩放后，高度视觉上变小了，但在文档流中还是原高度。
            // 加上 mb 确保底部有足够空间滚动
            marginBottom: `calc(-297mm * (1 - ${scale}))`
          }}
        >
          <div
            id="resume-preview"
            className="w-[210mm] h-[297mm] bg-white shadow-2xl transition-shadow overflow-hidden box-border"
            style={{ padding: '0' }} // Padding is now handled by the template content or can be added here if needed, but 'h-[297mm]' + 'box-border' ensures A4 size.
          >
            <TemplateEngine data={resumeData} />
          </div>
        </div>
      </div>

      {/* 内联样式用于字体样式 */}
      <style suppressHydrationWarning>{`
        :where(#resume-preview) {
          font-family: ${styles.fontFamily}, system-ui, sans-serif;
          font-size: ${styles.fontSize}px;
          line-height: 1.6;
          ${styles.highlight ? `background-color: #fefce8;` : ''}
          font-weight: ${styles.bold ? 'bold' : 'normal'};
          font-style: ${styles.italic ? 'italic' : 'normal'};
          text-decoration: ${styles.underline ? 'underline' : 'none'};
          box-sizing: border-box;
        }

        /* Enforce A4 height even if content overflows */
        #resume-preview {
          height: 297mm !important;
          max-height: 297mm !important;
          overflow: hidden !important;
          padding: 10mm !important; /* Fixed 10mm margin */
        }

        :where(#resume-preview) h1 {
          font-size: ${styles.headings.h1.size}px;
          font-weight: ${styles.headings.h1.weight};
          color: ${styles.headings.h1.color};
          line-height: 1.2;
          margin-bottom: 0.5em;
        }

        :where(#resume-preview) h2 {
          font-size: ${styles.headings.h2.size}px;
          font-weight: ${styles.headings.h2.weight};
          color: ${styles.headings.h2.color};
          line-height: 1.3;
          margin-bottom: 0.4em;
          margin-top: 0.8em;
        }

        :where(#resume-preview) h3 {
          font-size: ${styles.headings.h3.size}px;
          font-weight: ${styles.headings.h3.weight};
          color: ${styles.headings.h3.color};
          line-height: 1.4;
          margin-bottom: 0.3em;
        }

        :where(#resume-preview) ul, :where(#resume-preview) ol {
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        :where(#resume-preview) li {
          margin-bottom: 0.25em;
        }

        @media print {
          body { background: white; }
          .no-print { display: none; }
          #resume-preview {
            box-shadow: none;
            margin: 0;
            width: 100%;
            max-width: none;
            transform: none !important;
            transform-origin: top left !important;
          }
        }
      `}</style>
    </div>
  )
}