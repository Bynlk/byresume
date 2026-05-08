// 📁 store/resumeStore.ts
import { create } from 'zustand'
import { ResumeData } from '@/types'
import { initialResumeData } from '@/config/initialData'

export type SelectedContext = {
  section: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'custom' | null
  itemId?: string
  field?: string
  value?: string
} | null

interface ResumeStore {
  resumeData: ResumeData
  selectedContext: SelectedContext
  setResumeData: (data: ResumeData) => void
  setSelectedContext: (context: SelectedContext) => void
  updatePersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void
  addExperience: () => void
  updateExperience: (id: string, data: Partial<ResumeData['experience'][0]>) => void
  removeExperience: (id: string) => void
  addEducation: () => void
  updateEducation: (id: string, data: Partial<ResumeData['education'][0]>) => void
  removeEducation: (id: string) => void
  addSkill: () => void
  updateSkill: (id: string, data: Partial<ResumeData['skills'][0]>) => void
  removeSkill: (id: string) => void
  updateSkills: (skills: ResumeData['skills']) => void
  addProject: () => void
  updateProject: (id: string, data: Partial<ResumeData['projects'][0]>) => void
  removeProject: (id: string) => void
  reorderProjects: (newOrder: ResumeData['projects']) => void
  addCustomSection: () => void
  updateCustomSection: (id: string, data: Partial<ResumeData['customSections'][0]>) => void
  removeCustomSection: (id: string) => void
  updateStyles: (data: Partial<ResumeData['styles']>) => void
  reorderSections: (newOrder: string[]) => void
  reorderExperience: (newOrder: ResumeData['experience']) => void
  reorderEducation: (newOrder: ResumeData['education']) => void
  reorderSkills: (newOrder: ResumeData['skills']) => void
  reorderCustomSections: (newOrder: ResumeData['customSections']) => void
  updateTemplate: (templateId: string) => void
  updateThemeColor: (color: string) => void
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
}

const RESUME_STORAGE_KEY = 'byresume_data'

// 从本地存储加载数据
const loadFromLocalStorage = (): ResumeData | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(RESUME_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 验证数据结构
      if (parsed && parsed.personalInfo && parsed.experience && parsed.education) {
        return parsed
      }
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error)
  }
  return null
}

// 保存数据到本地存储
const saveToLocalStorage = (data: ResumeData): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存数据到本地存储失败:', error)
  }
}

// 初始化数据：优先使用本地存储的数据
const getInitialData = (): ResumeData => {
  const localData = loadFromLocalStorage()
  return localData || initialResumeData
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumeData: getInitialData(),
  selectedContext: null,

  setResumeData: (data) => {
    set({ resumeData: data })
    saveToLocalStorage(data)
  },

  setSelectedContext: (context) => set({ selectedContext: context }),

  updatePersonalInfo: (data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...data }
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  addExperience: () =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        experience: [
          ...state.resumeData.experience,
          {
            id: Date.now().toString(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        ]
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateExperience: (id, data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        experience: state.resumeData.experience.map((exp) =>
          exp.id === id ? { ...exp, ...data } : exp
        )
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  removeExperience: (id) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((exp) => exp.id !== id)
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  addEducation: () =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        education: [
          ...state.resumeData.education,
          {
            id: Date.now().toString(),
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        ]
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateEducation: (id, data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        education: state.resumeData.education.map((edu) =>
          edu.id === id ? { ...edu, ...data } : edu
        )
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  removeEducation: (id) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        education: state.resumeData.education.filter((edu) => edu.id !== id)
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  addSkill: () =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        skills: [
          ...state.resumeData.skills,
          {
            id: Date.now().toString(),
            name: '',
            level: 3,
            category: ''
          }
        ]
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateSkill: (id, data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        skills: state.resumeData.skills.map((skill) =>
          skill.id === id ? { ...skill, ...data } : skill
        )
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  removeSkill: (id) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((skill) => skill.id !== id)
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateSkills: (skills) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        skills
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  addProject: () =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        projects: [
          ...state.resumeData.projects,
          {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: [],
            startDate: '',
            endDate: '',
            link: ''
          }
        ]
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateProject: (id, data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        projects: state.resumeData.projects.map((project) =>
          project.id === id ? { ...project, ...data } : project
        )
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  removeProject: (id) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((project) => project.id !== id)
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  reorderProjects: (newOrder) =>
    set((state) => {
      const newData = { ...state.resumeData, projects: newOrder }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  addCustomSection: () =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        customSections: [
          ...state.resumeData.customSections,
          {
            id: Date.now().toString(),
            title: '',
            content: ''
          }
        ]
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateCustomSection: (id, data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        customSections: state.resumeData.customSections.map((section) =>
          section.id === id ? { ...section, ...data } : section
        )
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  removeCustomSection: (id) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        customSections: state.resumeData.customSections.filter((section) => section.id !== id)
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateStyles: (data) =>
    set((state) => {
      const newData = {
        ...state.resumeData,
        styles: { ...state.resumeData.styles, ...data }
      }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  reorderSections: (newOrder) =>
    set((state) => {
      const newData = { ...state.resumeData, sectionOrder: newOrder }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  reorderExperience: (newOrder) =>
    set((state) => {
      const newData = { ...state.resumeData, experience: newOrder }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  reorderEducation: (newOrder) =>
    set((state) => {
      const newData = { ...state.resumeData, education: newOrder }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  reorderSkills: (newOrder) =>
    set((state) => {
      const newData = { ...state.resumeData, skills: newOrder }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  reorderCustomSections: (newOrder) =>
    set((state) => {
      const newData = { ...state.resumeData, customSections: newOrder }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateTemplate: (templateId) =>
    set((state) => {
      const newData = { ...state.resumeData, templateId }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  updateThemeColor: (color) =>
    set((state) => {
      const newData = { ...state.resumeData, themeColor: color }
      saveToLocalStorage(newData)
      return { resumeData: newData }
    }),

  loadFromLocalStorage: () => {
    const localData = loadFromLocalStorage()
    if (localData) {
      set({ resumeData: localData })
    }
  },

  saveToLocalStorage: () => {
    const { resumeData } = get()
    saveToLocalStorage(resumeData)
  }
}))