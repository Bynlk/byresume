'use client'

import { ResumeData } from '@/types'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import TechTemplate from './templates/TechTemplate'
import ElegantTemplate from './templates/ElegantTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import ModernMinimalTemplate from './templates/ModernMinimalTemplate'
import { ComponentType } from 'react'

interface TemplateEngineProps {
    data: ResumeData
}

// 模板组件类型
type TemplateComponent = ComponentType<{ data: ResumeData }>

// 模板映射表 - 使用 Map 替代 if 链，提高可维护性
const TEMPLATE_MAP = new Map<string, TemplateComponent>([
    // Modern 模板
    ['tpl-1', ModernTemplate],
    ['modern', ModernTemplate],
    
    // Classic 模板
    ['tpl-2', ClassicTemplate],
    ['tpl-7', ClassicTemplate],
    ['classic', ClassicTemplate],
    
    // Minimal 模板
    ['tpl-3', MinimalTemplate],
    ['minimal', MinimalTemplate],
    
    // Creative 模板
    ['tpl-5', CreativeTemplate],
    ['creative', CreativeTemplate],
    
    // Tech 模板
    ['tpl-9', TechTemplate],
    ['tech', TechTemplate],
    
    // Elegant 模板
    ['tpl-10', ElegantTemplate],
    ['elegant', ElegantTemplate],
    
    // Professional 模板
    ['tpl-11', ProfessionalTemplate],
    ['professional', ProfessionalTemplate],
    
    // Modern Minimal 模板
    ['tpl-12', ModernMinimalTemplate],
    ['modernminimal', ModernMinimalTemplate],
])

// 默认模板
const DEFAULT_TEMPLATE = ModernTemplate

/**
 * 模板引擎组件
 * 根据 templateId 渲染对应的简历模板
 * 
 * @param {TemplateEngineProps} props - 组件属性
 * @returns {JSX.Element} 渲染的模板组件
 */
export default function TemplateEngine({ data }: TemplateEngineProps) {
    const templateId = data.templateId || 'tpl-1'
    
    // 从映射表中查找模板组件
    const TemplateComponent = TEMPLATE_MAP.get(templateId) || DEFAULT_TEMPLATE
    
    return <TemplateComponent data={data} />
}

/**
 * 获取所有可用模板列表
 * @returns 模板 ID 和名称的映射
 */
export function getAvailableTemplates(): Array<{ id: string; name: string }> {
    return [
        { id: 'tpl-1', name: 'Modern' },
        { id: 'tpl-2', name: 'Classic' },
        { id: 'tpl-3', name: 'Minimal' },
        { id: 'tpl-5', name: 'Creative' },
        { id: 'tpl-9', name: 'Tech' },
        { id: 'tpl-10', name: 'Elegant' },
        { id: 'tpl-11', name: 'Professional' },
        { id: 'tpl-12', name: 'Modern Minimal' },
    ]
}

/**
 * 检查模板是否存在
 * @param templateId 模板 ID
 * @returns 是否存在
 */
export function isValidTemplate(templateId: string): boolean {
    return TEMPLATE_MAP.has(templateId)
}
