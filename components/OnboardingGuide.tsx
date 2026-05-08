// 📁 ByResume/components/OnboardingGuide.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, FileText, Bot, Download, Palette, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'

interface OnboardingGuideProps {
  onComplete: () => void
}

const STEPS = [
  {
    title: '欢迎使用 ByResume',
    description: '这是一个 AI 赋能的简历编辑器，帮助你快速创建专业的简历。让我们快速了解一下主要功能。',
    icon: FileText,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: '编辑你的简历',
    description: '左侧面板可以编辑个人信息、工作经历、教育背景和技能。所有修改都会实时显示在预览区。',
    icon: Palette,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    title: 'AI 智能助手',
    description: '点击右上角的 AI 按钮打开智能助手。配置你的 API Key 后，AI 可以帮你优化简历内容、检查语法错误。',
    icon: Bot,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: '选择模板和颜色',
    description: '顶部可以选择不同的简历模板和主题颜色，共有 20 种组合供你选择。',
    icon: Sparkles,
    color: 'from-violet-500 to-violet-600'
  },
  {
    title: '导出你的简历',
    description: '编辑完成后，点击"导出"按钮可以下载 PDF 文件或导出 JSON 数据备份。',
    icon: Download,
    color: 'from-rose-500 to-rose-600'
  }
]

export default function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 检查是否已完成引导
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed')
    if (!hasCompletedOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true')
    setIsVisible(false)
    onComplete()
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding-completed', 'true')
    setIsVisible(false)
    onComplete()
  }

  if (!isVisible) return null

  const step = STEPS[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 弹窗 */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10"
        >
          <X size={20} />
        </button>

        {/* 图标区域 */}
        <div className={`h-40 bg-gradient-to-r ${step.color} flex items-center justify-center`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Icon size={40} className="text-white" />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {step.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* 进度指示器 */}
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep
                    ? 'w-6 bg-blue-600'
                    : idx < currentStep
                      ? 'w-2 bg-blue-400'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
              />
            ))}
          </div>

          {/* 按钮区域 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              跳过引导
            </button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrev}>
                  <ChevronLeft size={16} />
                  上一步
                </Button>
              )}
              <Button variant="default" size="sm" onClick={handleNext}>
                {currentStep === STEPS.length - 1 ? '开始使用' : '下一步'}
                {currentStep < STEPS.length - 1 && <ChevronRight size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
