// 📁 types/index.ts
export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  customSections: CustomSection[]
  styles: ResumeStyles
  templateId?: string
  sectionOrder: string[]
  themeColor?: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  link?: string
}

export interface ResumeStyles {
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  highlight: boolean
  headings: HeadingStyles
}

export interface HeadingStyles {
  h1: TextStyle
  h2: TextStyle
  h3: TextStyle
}

export interface TextStyle {
  size: number
  weight: string
  color: string
}

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  fullName?: string
  links: Array<{ platform: string; url: string }>
  customFields?: Array<{ id: string; label: string; value: string }>
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export interface Skill {
  id: string
  name: string
  level?: number
  category?: string
}