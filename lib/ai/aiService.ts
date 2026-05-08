// 📁 ByResume/lib/ai/aiService.ts
'use client'

import { ResumeData } from '@/types'
import { SelectedContext } from '@/store/resumeStore'

export type AIProvider = 'openai' | 'deepseek' | 'anthropic' | 'custom'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model?: string
  customEndpoint?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// 从 localStorage 获取 AI 配置
export function getAIConfig(): AIConfig | null {
  if (typeof window === 'undefined') return null
  const config = localStorage.getItem('ai-config')
  return config ? JSON.parse(config) : null
}

// 保存 AI 配置到 localStorage
export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem('ai-config', JSON.stringify(config))
}

// 清除 AI 配置
export function clearAIConfig(): void {
  localStorage.removeItem('ai-config')
}

// 获取默认模型
function getDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case 'openai':
      return 'gpt-3.5-turbo'
    case 'deepseek':
      return 'deepseek-chat'
    case 'anthropic':
      return 'claude-3-haiku-20240307'
    default:
      return 'deepseek-chat'
  }
}

// 构建简历上下文提示词
export function buildResumeContext(resumeData: ResumeData, selectedContext: SelectedContext = null): string {
  const experienceText = resumeData.experience
    .map(
      (exp) =>
        `- ${exp.company} | ${exp.position} (${exp.startDate} - ${exp.endDate})
  ${exp.description}`
    )
    .join('\\n')

  const educationText = resumeData.education
    .map(
      (edu) =>
        `- ${edu.school} | ${edu.degree} (${edu.startDate} - ${edu.endDate})
  ${edu.description ?? ''}`
    )
    .join('\\n')

  const projectsText = resumeData.projects
    .map(
      (proj) =>
        `- ${proj.name} (${proj.startDate} - ${proj.endDate})
  ${proj.description}
  技术栈：${proj.technologies.join(', ')}${proj.link ? `\n  链接：${proj.link}` : ''}`
    )
    .join('\\n')

  let context = `当前简历内容：
姓名：${resumeData.personalInfo.fullName}
职位：${resumeData.personalInfo.title}
邮箱：${resumeData.personalInfo.email}
电话：${resumeData.personalInfo.phone}
个人简介：${resumeData.personalInfo.summary}

工作经历：
${experienceText}

教育背景：
${educationText}

技能：${resumeData.skills.map((s) => s.name).join(', ')}

项目经历：
${projectsText}`

  if (selectedContext) {
    context += `

当前选中模块：${selectedContext.section}`
    if (selectedContext.itemId) {
      const item = findItem(resumeData, selectedContext.section, selectedContext.itemId)
      if (item) {
        context += `
选中条目：${JSON.stringify(item, null, 2)}`
      }
    }
    if (selectedContext.field) {
      context += `
选中字段：${selectedContext.field}`
    }
    if (selectedContext.value) {
      context += `
当前值：${selectedContext.value}`
    }
  }

  return context
}

// 辅助函数：根据section和itemId查找条目
function findItem(resumeData: ResumeData, section: string | null, itemId: string) {
  if (!section) return null
  switch (section) {
    case 'experience':
      return resumeData.experience.find(exp => exp.id === itemId)
    case 'education':
      return resumeData.education.find(edu => edu.id === itemId)
    case 'personal':
      return resumeData.personalInfo
    case 'skills':
      return resumeData.skills.find(skill => skill.id === itemId)
    case 'custom':
      return resumeData.customSections.find(sec => sec.id === itemId)
    default:
      return null
  }
}

// 系统提示词
const SYSTEM_PROMPT = `你是一个专业的简历优化助手。你的任务是帮助用户：
1. 优化简历内容，使其更加专业和有吸引力
2. 检查并修正语法错误
3. 提供针对性的职业建议
4. 帮助量化工作成果
5. 优化关键词以提高 ATS（简历筛选系统）通过率

回答要求：
- 使用中文回复
- 建议要具体、可操作
- 保持专业但友好的语气
- 如果需要更多信息，请主动询问`

// 调用 AI API（使用后端代理）
export async function* streamChat(
  messages: ChatMessage[],
  resumeData: ResumeData,
  config: AIConfig,
  selectedContext: SelectedContext = null,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  // 构建系统提示词和上下文
  const context = buildResumeContext(resumeData, selectedContext)
  const systemPrompt = `${SYSTEM_PROMPT}\n\n${context}`

  // 重试机制
  const maxRetries = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (signal?.aborted) {
        throw new Error('请求已被用户中断')
      }

      // 调用后端代理
      const response = await fetch('/byresume/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          config, // 包含 apiKey, provider, model, customEndpoint
          systemPrompt
        }),
        signal
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API 请求失败Proxy (${response.status}): ${errorText}`)
      }

      if (!response.body) throw new Error('无法读取响应流')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        if (signal?.aborted) {
          reader.cancel()
          throw new Error('请求已被用户中断')
        }

        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        // 根据 Provider 解析不同格式
        if (config.provider === 'anthropic') {
          // Anthropic SSE 格式解析 (简化版，配合 Proxy 返回的原始流)
          // Anthropic 返回 event: ... data: ...
          // 这里我们简化处理，假设 Proxy 转发了原始 SSE
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                // Anthropic format: type: 'content_block_delta', delta: { text: '...' }
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  yield parsed.delta.text
                }
                // Older format or completion format check just in case
                else if (parsed.completion) {
                  yield parsed.completion
                }
              } catch { }
            }
          }
        } else {
          // OpenAI / DeepSeek SSE 格式
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content || ''
                if (text) yield text
              } catch { }
            }
          }
        }
      }
      return // 成功完成

    } catch (error) {
      lastError = error as Error
      if (error instanceof Error && error.message.includes('中断')) {
        throw error
      }
      if (attempt === maxRetries) break
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }
  }
  throw new Error(`AI 服务暂时不可用: ${lastError?.message}`)
}

// 测试 API 连接（通过服务端代理避免 CORS）
export async function testConnection(config: AIConfig): Promise<boolean> {
  try {
    const response = await fetch('/byresume/api/ai/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model || getDefaultModel(config.provider),
        customEndpoint: config.customEndpoint,
      }),
    })
    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}
