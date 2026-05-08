// 📁 config/initialData.ts
import { ResumeData } from '@/types'

/**
 * 初始简历数据
 * 用于当本地存储中没有数据时的默认值
 */
export const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Bynlk',
    fullName: 'Bynlk',
    title: '前端开发实习生',
    email: 'bynlk@bynlk.cc',
    phone: '123-4567-8910',
    location: '东莞',
    summary: '对前端开发充满热情，具备扎实的 HTML、CSS 和 JavaScript 基础。熟悉 Vue.js 框架，了解现代前端工程化工具。具备良好的学习能力和团队协作精神，渴望在实际项目中锻炼技能，为团队贡献价值。',
    links: []
  },
  experience: [
    {
      id: '1',
      company: '字节跳动',
      position: '前端开发实习生',
      startDate: '2025.6',
      endDate: '2025.9',
      description: '<ul><li>负责组件开发和维护，提升页面性能</li><li>参与需求评审和技术方案设计</li><li>修复Bug和优化用户体验</li></ul>'
    }
  ],
  education: [
    {
      id: '1',
      school: '霍格沃茨魔法学院',
      degree: '魔法',
      field: '计算机技术与巫术',
      startDate: '2023.9',
      endDate: '2027',
      description: '在霍格沃茨魔法学院学习了计算机技术与巫术，掌握了扎实的理论知识和实践技能。在校期间积极参与项目实践，积累了丰富的项目经验。具备良好的学习能力和团队协作精神，渴望在实际项目中锻炼技能，为团队贡献价值。'
    }
  ],
  skills: [
    { id: '1', name: 'HTML5', level: 4, category: '前端' },
    { id: '2', name: 'CSS3', level: 4, category: '前端' },
    { id: '3', name: 'JavaScript (ES6+)', level: 4, category: '前端' },
    { id: '4', name: 'Vue.js', level: 3, category: '前端' },
    { id: '5', name: 'React', level: 3, category: '前端' },
    { id: '6', name: 'TypeScript', level: 3, category: '前端' },
    { id: '7', name: 'Git', level: 3, category: '工具' },
    { id: '8', name: 'Webpack', level: 2, category: '构建工具' },
    { id: '9', name: 'Vite', level: 3, category: '构建工具' },
    { id: '10', name: 'Sass/Less', level: 3, category: '前端' },
    { id: '11', name: 'Flex/Grid', level: 4, category: '前端' }
  ],
  projects: [
    {
      id: '1',
      name: 'ByResume 简历编辑器',
      description: '<ul><li>独立设计并开发基于 Next.js 14 的智能简历编辑器</li><li>实现实时预览、多模板切换、PDF 导出等核心功能</li><li>集成 TipTap 富文本编辑器，支持拖拽排序</li><li>使用 Zustand 状态管理，优化用户体验</li><li>支持深色/浅色主题切换，响应式布局设计</li></ul>',
      technologies: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'TipTap', 'Zustand'],
      startDate: '2024.12',
      endDate: '至今',
      link: ''
    }
  ],
  customSections: [],
  styles: {
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
  },
  templateId: 'tpl-1',
  sectionOrder: ['personal', 'experience', 'education', 'skills', 'projects', 'custom'],
  themeColor: 'blue'
}

/**
 * 获取初始简历数据（深拷贝）
 * @returns 初始简历数据
 */
export function getInitialResumeData(): ResumeData {
  return JSON.parse(JSON.stringify(initialResumeData))
}
