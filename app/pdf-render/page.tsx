'use client'

// 导入本地字体包 - 确保PDF导出时字体正确加载
import '@fontsource/noto-sans-sc/400.css'  // Noto Sans SC Regular - Modern/Creative模板
import '@fontsource/noto-sans-sc/700.css'  // Noto Sans SC Bold - Modern/Creative模板

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TemplateEngine from '@/lib/resume/TemplateEngine'
import { ResumeData } from '@/types'

export default function PdfRenderPage() {
  const searchParams = useSearchParams()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data')
      
      if (!dataParam) {
        setError('缺少简历数据参数')
        return
      }

      const decoded = decodeURIComponent(dataParam)
      const parsed = JSON.parse(decoded) as ResumeData
      
      setResumeData(parsed)

      // 等待字体加载完成后标记渲染就绪
      if (typeof window !== 'undefined') {
        document.fonts.ready.then(() => {
          document.body.setAttribute('data-render-ready', 'true')
          console.log('PDF渲染页面准备就绪')
        })
      }
    } catch (err) {
      console.error('解析简历数据失败:', err)
      setError('解析简历数据失败')
    }
  }, [searchParams])

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        错误: {error}
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div style={{ padding: '20px' }}>
        加载中...
      </div>
    )
  }

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

  return (
    <>
      {/* PDF渲染容器 - 与PreviewPanel相同的结构 */}
      <div
        id="resume-preview"
        className="w-[210mm] h-[297mm] bg-white overflow-hidden box-border"
        style={{ padding: '0' }}
      >
        <TemplateEngine data={resumeData} />
      </div>

      {/* 字体配置 - 本地字体 */}
      <style suppressHydrationWarning>{`
        /* Noto Serif SC - Classic/Minimal模板使用 */
        @font-face {
          font-family: 'Noto Serif SC';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('Noto Serif SC'), local('NotoSerifSC-Regular'), local('Source Han Serif SC'), local('SourceHanSerifSC-Regular'), local('Microsoft YaHei'), local('SimSun');
        }

        @font-face {
          font-family: 'Noto Serif SC';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: local('Noto Serif SC Bold'), local('NotoSerifSC-Bold'), local('Source Han Serif SC Bold'), local('Microsoft YaHei Bold'), local('SimHei');
        }

        /* Noto Sans Mono - Tech模板使用 */
        @font-face {
          font-family: 'Noto Sans Mono';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('Noto Sans Mono'), local('Consolas'), local('Monaco'), local('Courier New'), monospace;
        }

        /* Inter - 默认字体 */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('Inter'), local('Arial'), local('Helvetica'), sans-serif;
        }

        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: local('Inter SemiBold'), local('Inter-SemiBold'), local('Arial Bold'), sans-serif;
        }

        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: local('Inter Bold'), local('Inter-Bold'), local('Arial Bold'), sans-serif;
        }

        /* 基础容器样式 */
        :where(#resume-preview) {
          font-family: ${styles.fontFamily}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
          font-size: ${styles.fontSize}px;
          line-height: 1.6;
          ${styles.highlight ? `background-color: #fefce8;` : ''}
          font-weight: ${styles.bold ? 'bold' : 'normal'};
          font-style: ${styles.italic ? 'italic' : 'normal'};
          text-decoration: ${styles.underline ? 'underline' : 'none'};
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* 确保容器尺寸 */
        #resume-preview {
          height: 297mm !important;
          max-height: 297mm !important;
          overflow: hidden !important;
          padding: 10mm !important;
          width: 210mm !important;
          margin: 0 auto;
        }

        /* 标题样式 */
        :where(#resume-preview) h1 {
          font-size: ${styles.headings.h1.size}px;
          font-weight: ${styles.headings.h1.weight};
          color: ${styles.headings.h1.color};
          line-height: 1.2;
          margin-bottom: 0.5em;
          font-family: 'Noto Sans SC', sans-serif;
        }

        :where(#resume-preview) h2 {
          font-size: ${styles.headings.h2.size}px;
          font-weight: ${styles.headings.h2.weight};
          color: ${styles.headings.h2.color};
          line-height: 1.3;
          margin-bottom: 0.4em;
          margin-top: 0.8em;
          font-family: 'Noto Sans SC', sans-serif;
        }

        :where(#resume-preview) h3 {
          font-size: ${styles.headings.h3.size}px;
          font-weight: ${styles.headings.h3.weight};
          color: ${styles.headings.h3.color};
          line-height: 1.4;
          margin-bottom: 0.3em;
          font-family: 'Noto Sans SC', sans-serif;
        }

        /* 列表样式 */
        :where(#resume-preview) ul, :where(#resume-preview) ol {
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        
        :where(#resume-preview) li {
          margin-bottom: 0.25em;
        }

        /* 内容元素字体继承 */
        :where(#resume-preview) span,
        :where(#resume-preview) div,
        :where(#resume-preview) p,
        :where(#resume-preview) a {
          font-family: inherit;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* 打印优化 */
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          #resume-preview {
            box-shadow: none;
            margin: 0;
            width: 100%;
            max-width: none;
            height: 100% !important;
            padding: 10mm !important;
          }
        }

        /* 隐藏滚动条 */
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
