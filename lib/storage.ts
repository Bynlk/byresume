/**
 * 统一的本地存储管理器
 * 提供类型安全的 localStorage 操作，统一管理所有本地存储键名
 */

// 存储键名枚举
export const STORAGE_KEYS = {
  RESUME_DATA: 'byresume_data',
  AI_CONFIG: 'ai-config',
  AI_CHAT_HISTORY: 'ai-chat-history',
  EVENTS: 'byresume_events',
  THEME: 'byresume-theme',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

// 存储事件类型
export interface StorageEvent {
  key: StorageKey | 'all'
  action: 'get' | 'set' | 'remove' | 'clear'
  success: boolean
  error?: string
}

// 存储事件监听器
type StorageEventListener = (event: StorageEvent) => void
const listeners: StorageEventListener[] = []

/**
 * 订阅存储事件
 */
export function subscribeToStorageEvents(listener: StorageEventListener): () => void {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

/**
 * 触发存储事件
 */
function emitStorageEvent(event: StorageEvent): void {
  listeners.forEach((listener) => listener(event))
}

/**
 * 检查 localStorage 是否可用
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * 获取存储项
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  const event: StorageEvent = { key, action: 'get', success: false }

  if (!isStorageAvailable()) {
    event.error = 'localStorage 不可用'
    emitStorageEvent(event)
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      event.success = true
      emitStorageEvent(event)
      return defaultValue
    }

    const parsed = JSON.parse(item) as T
    event.success = true
    emitStorageEvent(event)
    return parsed
  } catch (error) {
    event.error = error instanceof Error ? error.message : '解析失败'
    emitStorageEvent(event)
    console.error(`[Storage] 获取 ${key} 失败:`, error)
    return defaultValue
  }
}

/**
 * 设置存储项
 */
export function setStorageItem<T>(key: StorageKey, value: T): boolean {
  const event: StorageEvent = { key, action: 'set', success: false }

  if (!isStorageAvailable()) {
    event.error = 'localStorage 不可用'
    emitStorageEvent(event)
    return false
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
    event.success = true
    emitStorageEvent(event)

    // 触发自定义事件，用于跨标签页同步
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(value),
      })
    )

    return true
  } catch (error) {
    event.error = error instanceof Error ? error.message : '存储失败'
    emitStorageEvent(event)
    console.error(`[Storage] 设置 ${key} 失败:`, error)
    return false
  }
}

/**
 * 移除存储项
 */
export function removeStorageItem(key: StorageKey): boolean {
  const event: StorageEvent = { key, action: 'remove', success: false }

  if (!isStorageAvailable()) {
    event.error = 'localStorage 不可用'
    emitStorageEvent(event)
    return false
  }

  try {
    localStorage.removeItem(key)
    event.success = true
    emitStorageEvent(event)

    // 触发自定义事件
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        newValue: null,
      })
    )

    return true
  } catch (error) {
    event.error = error instanceof Error ? error.message : '移除失败'
    emitStorageEvent(event)
    console.error(`[Storage] 移除 ${key} 失败:`, error)
    return false
  }
}

/**
 * 清除所有应用相关的存储项
 */
export function clearAppStorage(): boolean {
  const event: StorageEvent = { key: 'all', action: 'clear', success: false }

  if (!isStorageAvailable()) {
    event.error = 'localStorage 不可用'
    emitStorageEvent(event)
    return false
  }

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
    event.success = true
    emitStorageEvent(event)
    return true
  } catch (error) {
    event.error = error instanceof Error ? error.message : '清除失败'
    emitStorageEvent(event)
    console.error('[Storage] 清除存储失败:', error)
    return false
  }
}

/**
 * 获取所有应用存储项的大小（字节）
 */
export function getStorageSize(): number {
  if (!isStorageAvailable()) return 0

  let totalSize = 0
  Object.values(STORAGE_KEYS).forEach((key) => {
    const item = localStorage.getItem(key)
    if (item) {
      totalSize += key.length + item.length
    }
  })
  return totalSize
}

/**
 * 存储管理器对象
 */
export const storage = {
  get: getStorageItem,
  set: setStorageItem,
  remove: removeStorageItem,
  clear: clearAppStorage,
  getSize: getStorageSize,
  isAvailable: isStorageAvailable,
  subscribe: subscribeToStorageEvents,
  keys: STORAGE_KEYS,
}
