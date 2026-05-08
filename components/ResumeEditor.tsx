// 📁 components/ResumeEditor.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ResumeData } from '@/types'
import PreviewPanel from './PreviewPanel'
import AIConfigModal from './AIConfigModal'
import Header from './Header'
import { useResumeStore } from '@/store/resumeStore'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Bot, Settings, HelpCircle, Github, Info, FileText } from 'lucide-react'
import EditorSidebar from './editor/EditorSidebar'
import EditorContent from './editor/EditorContent'
import FeedbackModal from './FeedbackModal'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

interface ResumeEditorProps {
  initialData: ResumeData
}

export default function ResumeEditor({ initialData }: ResumeEditorProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('editor')
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    custom: true,
  })
  const sidebarRef = useRef<HTMLDivElement>(null)
  const editorContentRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { resumeData, setResumeData, reorderSections, loadFromLocalStorage } = useResumeStore()

  // 组件挂载时同步本地存储和服务器数据
  useEffect(() => {
    // 优先使用服务器数据，但如果本地有数据且服务器数据是默认值，则保留本地数据
    const localData = localStorage.getItem('byresume_data')
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        // 如果本地数据存在，且服务器数据是默认值，则使用本地数据
        // 否则使用服务器数据
        if (initialData && initialData.personalInfo.name === 'Bynlk' && parsed.personalInfo?.name) {
          // 服务器是默认数据，本地有自定义数据，使用本地数据
          loadFromLocalStorage()
        } else if (initialData) {
          // 使用服务器数据
          setResumeData(initialData)
        }
      } catch (error) {
        console.error('解析本地数据失败:', error)
        if (initialData) {
          setResumeData(initialData)
        }
      }
    } else if (initialData) {
      // 没有本地数据，使用服务器数据
      setResumeData(initialData)
    }
  }, [initialData, loadFromLocalStorage, setResumeData])

  // 拖拽结束处理
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return
    if (active.id === over.id) return

    const sectionOrder = resumeData.sectionOrder || ['personal', 'experience', 'education', 'skills', 'custom']
    const oldIndex = sectionOrder.indexOf(active.id as string)
    const newIndex = sectionOrder.indexOf(over.id as string)

    if (oldIndex === -1 || newIndex === -1) return

    reorderSections(arrayMove(sectionOrder, oldIndex, newIndex))
  }, [resumeData.sectionOrder, reorderSections])

  // 切换部分展开/折叠
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  // 处理标签页切换
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'editor' | 'ai')
  }, [])

  // 处理点击外部关闭侧边栏（移动端）
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isEditorOpen || window.innerWidth >= 1024) return

      const sidebar = sidebarRef.current
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsEditorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEditorOpen])

  // 打开GitHub仓库
  const openGitHub = () => {
    window.open('https://github.com/277188/ByResume', '_blank')
  }

  return (
    <>
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onPrint={() => window.print()}
        onToggleSidebar={() => setIsEditorOpen(!isEditorOpen)}
        onOpenFeedback={() => setShowFeedbackModal(true)}
      />

      <main className="flex-1 flex h-full overflow-hidden bg-muted">
        {/* 左侧边栏 */}
        <EditorSidebar
          isEditorOpen={isEditorOpen}
          activeTab={activeTab}
          expandedSections={expandedSections}
          sidebarRef={sidebarRef}
          editorContentRef={editorContentRef}
          onToggleSidebar={() => setIsEditorOpen(!isEditorOpen)}
          onTabChange={handleTabChange}
          onToggleSection={toggleSection}
          onOpenSettings={() => setShowAboutModal(true)}
        >
          <EditorContent
            resumeData={resumeData}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onDragEnd={handleDragEnd}
          />
        </EditorSidebar>

        {/* 主内容区域 - 自适应布局 */}
        <div className={`flex-1 flex flex-col min-h-0 ${isEditorOpen ? 'lg:ml-80' : 'lg:ml-[60px]'}`}>
          <PreviewPanel />
        </div>

        {/* 移动端侧边栏遮罩 */}
        {isEditorOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setIsEditorOpen(false)}
          />
        )}

        {/* AI 配置弹窗 */}
        <AIConfigModal
          isOpen={showAIConfig}
          onClose={() => setShowAIConfig(false)}
          onConfigured={() => setShowAIConfig(false)}
        />

        {/* 设置与信息弹窗 */}
        {showAboutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              {/* 头部 */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Settings size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">设置与信息</h3>
                    <p className="text-sm text-muted-foreground">简历生成器 v1.0.0</p>
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-6 space-y-6">
                {/* AI 设置 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Bot size={16} className="text-purple-500" />
                    AI 设置
                  </h4>
                  <button
                    onClick={() => {
                      setShowAboutModal(false)
                      setShowAIConfig(true)
                    }}
                    className="w-full px-4 py-2.5 bg-secondary hover:bg-muted text-secondary-foreground rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Settings size={16} />
                    配置 AI API Key
                  </button>
                </div>

                {/* 使用说明 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <HelpCircle size={16} className="text-blue-500" />
                    使用说明
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>在左侧编辑简历内容，右侧实时预览</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>使用字体样式编辑器调整文本格式</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>添加自定义模块扩展简历内容</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>点击打印按钮生成PDF简历</span>
                    </li>
                  </ul>
                </div>

                {/* 开源与社区 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Github size={16} className="text-muted-foreground" />
                    开源与社区
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={openGitHub}
                      className="w-full px-4 py-2.5 bg-secondary hover:bg-muted text-secondary-foreground rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Github size={16} />
                      查看开源代码
                    </button>
                    <div className="text-sm text-foreground/70 space-y-2">
                      <p>本项目基于 MIT 协议开源，欢迎贡献代码和提出建议。</p>
                    </div>
                  </div>
                </div>

                {/* 技术栈 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Info size={16} className="text-green-500" />
                    技术栈
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">React</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs">Next.js</span>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs">Tailwind CSS</span>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-xs">TypeScript</span>
                  </div>
                </div>

                {/* 关于 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-orange-500" />
                    关于项目
                  </h4>
                  <p className="text-sm text-foreground/70">
                    这是一个现代化的在线简历生成器，旨在帮助用户快速创建专业的简历，并提供AI辅助优化功能。
                  </p>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="p-6 border-t border-border">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 反馈模态框 */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      </main>
    </>
  )
}
