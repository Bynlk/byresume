// 📁 components/editor/EditorSidebar.tsx
'use client'

import { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, FileEdit, Bot, Settings } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import AIAssistantPanel from '@/components/AIAssistantPanel'
import { cn } from '@/lib/utils'

interface EditorSidebarProps {
  /** 侧边栏是否展开 */
  isEditorOpen: boolean
  /** 当前激活的标签页 */
  activeTab: string
  /** 展开状态的区域集合 */
  expandedSections: Record<string, boolean>
  /** 侧边栏引用 */
  sidebarRef: React.RefObject<HTMLDivElement>
  /** 编辑器内容引用 */
  editorContentRef: React.RefObject<HTMLDivElement>
  /** 切换侧边栏展开状态 */
  onToggleSidebar: () => void
  /** 切换标签页 */
  onTabChange: (value: string) => void
  /** 切换区域展开/折叠 */
  onToggleSection: (section: string) => void
  /** 打开设置弹窗 */
  onOpenSettings: () => void
  /** 编辑器内容 */
  children: ReactNode
}

/**
 * 编辑器侧边栏组件
 * 包含标签切换、编辑器内容和 AI 助手面板
 */
export default function EditorSidebar({
  isEditorOpen,
  activeTab,
  sidebarRef,
  editorContentRef,
  onToggleSidebar,
  onTabChange,
  onOpenSettings,
  children,
}: EditorSidebarProps) {
  return (
    <div
      ref={sidebarRef}
      className={`fixed lg:fixed left-0 top-16 lg:top-16 bottom-0 z-30 transition-all duration-300
        ${isEditorOpen ? 'w-80' : 'w-[60px]'}`}
    >
      <div className="h-full flex flex-col bg-background border-r border-border">
        {/* 折叠状态 */}
        {!isEditorOpen && <CollapsedSidebar onExpand={onToggleSidebar} activeTab={activeTab} onTabChange={onTabChange} />}
        
        {/* 展开状态 */}
        {isEditorOpen && (
          <ExpandedSidebar
            activeTab={activeTab}
            editorContentRef={editorContentRef}
            onToggleSidebar={onToggleSidebar}
            onTabChange={onTabChange}
            onOpenSettings={onOpenSettings}
          >
            {children}
          </ExpandedSidebar>
        )}
      </div>
    </div>
  )
}

/**
 * 折叠状态的侧边栏
 */
function CollapsedSidebar({
  onExpand,
  activeTab,
  onTabChange,
}: {
  onExpand: () => void
  activeTab: string
  onTabChange: (value: string) => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center py-4 space-y-4">
      {/* 展开按钮 */}
      <button
        onClick={onExpand}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
        title="展开侧边栏"
        aria-label="展开侧边栏"
      >
        <ChevronRight size={18} />
      </button>

      {/* 编辑按钮 */}
      <button
        onClick={() => {
          onExpand()
          onTabChange('editor')
        }}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 border",
          activeTab === 'editor'
            ? "bg-primary text-primary-foreground border-primary shadow-md"
            : "bg-background text-muted-foreground border-transparent hover:border-border hover:bg-accent hover:text-accent-foreground"
        )}
        title="编辑简历"
        aria-label="编辑简历"
      >
        <FileEdit size={18} />
      </button>

      {/* AI 助手按钮 */}
      <button
        onClick={() => {
          onExpand()
          onTabChange('ai')
        }}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 border",
          activeTab === 'ai'
            ? "bg-primary text-primary-foreground border-primary shadow-md"
            : "bg-background text-muted-foreground border-transparent hover:border-border hover:bg-accent hover:text-accent-foreground"
        )}
        title="AI助手"
        aria-label="AI助手"
      >
        <Bot size={18} />
      </button>
    </div>
  )
}

/**
 * 展开状态的侧边栏
 */
function ExpandedSidebar({
  activeTab,
  editorContentRef,
  onToggleSidebar,
  onTabChange,
  onOpenSettings,
  children,
}: {
  activeTab: string
  editorContentRef: React.RefObject<HTMLDivElement>
  onToggleSidebar: () => void
  onTabChange: (value: string) => void
  onOpenSettings: () => void
  children: ReactNode
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 sidebar-scroll">
        {/* 标题栏 */}
        <div className="h-14 lg:h-16 border-b border-border flex items-center justify-between px-4 flex-shrink-0 sticky top-0 bg-background z-10">
          <div className="flex-1 pr-2">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full" defaultValue="editor">
              <TabsList className="grid w-full grid-cols-2 rounded-lg bg-secondary border border-border shadow-sm p-1">
                <TabsTrigger
                  value="editor"
                  className="flex items-center justify-center gap-2 px-2 py-1 text-sm data-[state=active]:bg-card rounded-md"
                >
                  <FileEdit size={16} className="text-muted-foreground" />
                  编辑
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="flex items-center justify-center gap-2 px-2 py-1 text-sm data-[state=active]:bg-card rounded-md"
                >
                  <Bot size={16} className="text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">
                    AI 助手
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 收起按钮 */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0"
            title="收起侧边栏"
            aria-label="收起侧边栏"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* 标签内容 */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col" defaultValue="editor">
          <div className="flex-1 min-h-0 h-full">
            <TabsContent value="editor" className="m-0 h-full">
              <div ref={editorContentRef} className="h-full flex flex-col">
                <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto touch-pan-y pb-24" suppressHydrationWarning>
                  {children}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai" className="m-0 h-full">
              <div className="h-full flex flex-col">
                <AIAssistantPanel
                  isOpen={activeTab === 'ai'}
                  onToggle={() => onTabChange(activeTab === 'ai' ? 'editor' : 'ai')}
                  className="flex-1"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* 底部设置按钮 */}
      <div className="sticky bottom-0 p-3 border-t border-border bg-background flex-shrink-0 z-10">
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors px-3 py-2 w-full"
          title="设置与信息"
          aria-label="设置与信息"
        >
          <Settings size={16} />
          <span className="text-sm">设置与信息</span>
        </button>
      </div>
    </div>
  )
}
