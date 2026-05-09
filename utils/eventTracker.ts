/**
 * 事件追踪工具
 * 用于记录用户行为事件（PDF导出、AI使用等）
 */

export type EventType = 'pdf_export' | 'ai_usage' | 'template_usage' | 'session_start' | 'session_end';

export interface EventData {
  type: EventType;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PdfExportEvent extends EventData {
  type: 'pdf_export';
  metadata: {
    templateId: string;
    format: string;
    fileName?: string;
  };
}

export interface AiUsageEvent extends EventData {
  type: 'ai_usage';
  metadata: {
    action: string;
    prompt?: string;
    model?: string;
  };
}

export interface TemplateUsageEvent extends EventData {
  type: 'template_usage';
  metadata: {
    templateId: string;
  };
}

// 本地存储键名
const STORAGE_KEY = 'byresume_events';
const MAX_EVENTS = 1000; // 最大存储事件数量

// 内存存储回退（当localStorage不可用时）
let memoryStorage: EventData[] = [];
let isStorageVerified = false;
let isStorageAvailable = true;

function checkStorageAvailability() {
  if (isStorageVerified) return isStorageAvailable;
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    isStorageAvailable = true;
  } catch (e) {
    isStorageAvailable = false;
    console.warn('LocalStorage不可用，已切换到内存存储模式');
  }
  isStorageVerified = true;
  return isStorageAvailable;
}

/**
 * 记录事件到本地存储
 */
export function recordEvent(event: EventData): void {
  try {
    // 从本地存储获取现有事件
    let events: EventData[] = [];

    if (checkStorageAvailability()) {
      const stored = localStorage.getItem(STORAGE_KEY);
      events = stored ? JSON.parse(stored) : [];
    } else {
      events = memoryStorage;
    }

    // 添加新事件
    events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    // 限制事件数量，移除最旧的事件
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }

    // 保存
    if (checkStorageAvailability()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } else {
      memoryStorage = events;
    }



    // 同时发送到服务器（如果可用）
    sendEventToServer(event).catch(() => {
      // 静默失败，本地存储已保存
    });
  } catch (error) {
    // 最后的安全网，如果连内存操作都失败了（极不可能）
    console.error('记录事件失败:', error);
  }
}

/**
 * 发送事件到服务器
 */
async function sendEventToServer(event: EventData): Promise<void> {
  try {
    const response = await fetch('/byresume/api/admin/record-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`服务器响应错误: ${response.status}`);
    }
  } catch {
    // 网络错误或服务器不可用，静默失败
  }
}

/**
 * 获取所有事件
 */
export function getAllEvents(): EventData[] {
  try {
    if (checkStorageAvailability()) {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } else {
      return memoryStorage;
    }
  } catch (error) {
    console.error('获取事件失败:', error);
    return memoryStorage; // 出错时尝试返回内存数据
  }
}

/**
 * 获取特定类型的事件
 */
export function getEventsByType(type: EventType): EventData[] {
  const events = getAllEvents();
  return events.filter(event => event.type === type);
}

/**
 * 获取最近N天的事件
 */
export function getEventsLastNDays(days: number): EventData[] {
  const events = getAllEvents();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  // 设置时间为当天的00:00:00，确保包含完整的一天
  cutoffDate.setHours(0, 0, 0, 0);

  return events.filter(event => {
    const eventDate = new Date(event.timestamp);
    return eventDate >= cutoffDate;
  });
}

/**
 * 获取PDF导出事件统计
 */
export function getPdfExportStats() {
  const allExports = getEventsByType('pdf_export') as PdfExportEvent[];
  const last30Days = getEventsLastNDays(30).filter(e => e.type === 'pdf_export') as PdfExportEvent[];

  // 按模板统计
  const templateDistribution: Record<string, number> = {};
  allExports.forEach(event => {
    const templateId = event.metadata?.templateId || 'unknown';
    templateDistribution[templateId] = (templateDistribution[templateId] || 0) + 1;
  });

  return {
    total: allExports.length,
    last30Days: last30Days.length,
    templateDistribution: Object.entries(templateDistribution).map(([templateId, count]) => ({
      templateId,
      count,
    })),
  };
}

/**
 * 获取AI使用事件统计
 */
export function getAiUsageStats() {
  const allAiUsage = getEventsByType('ai_usage') as AiUsageEvent[];
  const last30Days = getEventsLastNDays(30).filter(e => e.type === 'ai_usage') as AiUsageEvent[];

  return {
    total: allAiUsage.length,
    last30Days: last30Days.length,
  };
}

/**
 * 获取本地日期字符串（YYYY-MM-DD格式）
 */
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取每日趋势数据（最近30天）
 */
export function getDailyTrends() {
  const events = getEventsLastNDays(30);
  const dailyData: Record<string, { date: string; pdfExports: number; aiUsage: number }> = {};

  // 获取当前本地日期
  const now = new Date();

  // 初始化最近30天的数据（包括今天）
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = getLocalDateString(date);
    dailyData[dateStr] = { date: dateStr, pdfExports: 0, aiUsage: 0 };
  }

  // 统计每日事件
  events.forEach(event => {
    const eventDate = new Date(event.timestamp);
    const dateStr = getLocalDateString(eventDate);

    if (dailyData[dateStr]) {
      if (event.type === 'pdf_export') {
        dailyData[dateStr].pdfExports++;
      } else if (event.type === 'ai_usage') {
        dailyData[dateStr].aiUsage++;
      }
    }
  });

  // 转换为数组并按日期排序
  return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 清除所有事件
 */
export function clearAllEvents(): void {
  if (checkStorageAvailability()) {
    localStorage.removeItem(STORAGE_KEY);
  }
  memoryStorage = [];
}

/**
 * 导出事件数据为CSV
 */
export function exportEventsToCsv(): string {
  const events = getAllEvents();

  if (events.length === 0) {
    return 'type,timestamp,metadata\n';
  }

  const headers = ['type', 'timestamp', 'metadata'];
  const rows = events.map(event => [
    event.type,
    event.timestamp,
    JSON.stringify(event.metadata || {}),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}