// 📁 ByResume/components/AIConfigModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, Key, Check, Loader2, ExternalLink, Upload, Download } from 'lucide-react'
import { Button } from './ui/Button'
import {
  AIProvider,
  AIConfig,
  getAIConfig,
  saveAIConfig,
  clearAIConfig,
  testConnection
} from '@/lib/ai/aiService'
import { toast } from 'sonner'

interface AIConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onConfigured: (config: AIConfig) => void
}

const PROVIDERS: { id: AIProvider; name: string; description: string; docUrl: string }[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '国产大模型，性价比高，推荐使用',
    docUrl: 'https://platform.deepseek.com/api_keys'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT 系列模型，功能强大',
    docUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 系列模型，擅长写作',
    docUrl: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'custom',
    name: '自定义',
    description: '导入自定义 API 端点',
    docUrl: ''
  },
]

export default function AIConfigModal({ isOpen, onClose, onConfigured }: AIConfigModalProps) {
  const [provider, setProvider] = useState<AIProvider>('deepseek')
  const [apiKey, setApiKey] = useState('')
  const [customEndpoint, setCustomEndpoint] = useState('')
  const [model, setModel] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [importJson, setImportJson] = useState('')

  useEffect(() => {
    if (isOpen) {
      const config = getAIConfig()
      if (config) {
        setProvider(config.provider)
        setApiKey(config.apiKey)
        setCustomEndpoint(config.customEndpoint || '')
        setModel(config.model || '')
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('请输入 API Key')
      setTestResult('error')
      return
    }

    if (provider === 'custom' && !customEndpoint.trim()) {
      setErrorMessage('请输入自定义 API 端点')
      setTestResult('error')
      return
    }

    setIsTesting(true)
    setTestResult(null)
    setErrorMessage('')

    try {
      const success = await testConnection({ provider, apiKey, customEndpoint, model })
      if (success) {
        setTestResult('success')
      } else {
        setTestResult('error')
        setErrorMessage('连接失败，请检查 API Key 和端点是否正确')
      }
    } catch (err) {
      setTestResult('error')
      setErrorMessage('连接测试出错，请稍后重试')
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = () => {
    if (!apiKey.trim()) {
      setErrorMessage('请输入 API Key')
      setTestResult('error')
      return
    }

    if (provider === 'custom' && !customEndpoint.trim()) {
      setErrorMessage('请输入自定义 API 端点')
      setTestResult('error')
      return
    }

    const config: AIConfig = { provider, apiKey, customEndpoint, model }
    saveAIConfig(config)
    onConfigured(config)
    onClose()
  }

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson)
      if (parsed.apiKey) setApiKey(parsed.apiKey)
      if (parsed.provider) setProvider(parsed.provider)
      if (parsed.customEndpoint) setCustomEndpoint(parsed.customEndpoint)
      if (parsed.model) setModel(parsed.model)
      setTestResult(null)
      setErrorMessage('')
      setShowImport(false)
      toast.success('配置导入成功')
    } catch (err) {
      setErrorMessage('JSON 格式错误，请检查输入')
      setTestResult('error')
    }
  }

  const handleExport = () => {
    const config = {
      provider,
      apiKey,
      customEndpoint,
      model,
      exportTime: new Date().toISOString()
    }
    const json = JSON.stringify(config, null, 2)
    navigator.clipboard.writeText(json)
    toast.success('配置已复制到剪贴板')
  }

  const handleClear = () => {
    clearAIConfig()
    setApiKey('')
    setTestResult(null)
    setErrorMessage('')
  }

  const selectedProvider = PROVIDERS.find(p => p.id === provider)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗 */}
      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Key size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">配置 AI 服务</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4">
          {/* 提供商选择 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              选择 AI 提供商
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setProvider(p.id)
                    setTestResult(null)
                    setErrorMessage('')
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${provider === p.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-border hover:border-muted-foreground'
                    }`}
                >
                  <div className="text-sm font-medium text-foreground">
                    {p.name}
                  </div>
                </button>
              ))}
            </div>
            {selectedProvider && (
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedProvider.description}
              </p>
            )}
          </div>

          {/* API Key 输入 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                API Key
              </label>
              {selectedProvider && selectedProvider.docUrl && (
                <a
                  href={selectedProvider.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  获取 API Key <ExternalLink size={10} />
                </a>
              )}
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setTestResult(null)
                setErrorMessage('')
              }}
              placeholder={`输入你的 ${selectedProvider?.name || ''} API Key`}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 自定义端点输入 - 仅自定义模式显示 */}
          {provider === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                API 端点 URL
              </label>
              <input
                type="text"
                value={customEndpoint}
                onChange={(e) => {
                  setCustomEndpoint(e.target.value)
                  setTestResult(null)
                  setErrorMessage('')
                }}
                placeholder="https://api.example.com/v1/chat/completions"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          {/* 模型名称输入 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              模型名称 (可选)
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => {
                setModel(e.target.value)
                setTestResult(null)
                setErrorMessage('')
              }}
              placeholder="例如: gpt-3.5-turbo, deepseek-chat"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 导入导出按钮 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(true)}
              className="flex-1"
            >
              <Upload size={14} className="mr-1" />
              导入配置
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex-1"
            >
              <Download size={14} className="mr-1" />
              导出配置
            </Button>
          </div>

          {/* 测试结果 */}
          {testResult && (
            <div className={`p-3 rounded-lg text-sm ${testResult === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
              {testResult === 'success' ? (
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  连接成功！API Key 有效
                </div>
              ) : (
                <div>{errorMessage || '连接失败'}</div>
              )}
            </div>
          )}

          {/* 安全提示 */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-200 dark:text-amber-700">
              <strong>安全提示：</strong>API Key 仅存储在你的浏览器本地，不会上传到任何服务器。请确保在私人设备上使用。
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-secondary">
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-700"
          >
            清除配置
          </button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={isTesting || !apiKey.trim()}
            >
              {isTesting ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1" />
                  测试中...
                </>
              ) : '测试连接'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!apiKey.trim()}
            >
              保存配置
            </Button>
          </div>
        </div>
      </div>

      {/* 导入配置弹窗 */}
      {showImport && (
        <div className="fixed inset-0 z-51 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowImport(false)} />
          <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">导入配置</h3>
              <button onClick={() => setShowImport(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='粘贴 JSON 配置，例如: {"provider": "deepseek", "apiKey": "sk-..."}'
              className="w-full h-32 px-3 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleImport} className="flex-1">
                导入
              </Button>
              <Button variant="outline" onClick={() => setShowImport(false)} className="flex-1">
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
