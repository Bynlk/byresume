// 📁 lib/errorHandler.ts
/**
 * 统一错误处理工具
 * 提供标准化的错误处理、日志记录和用户反馈
 */

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  CLIENT = 'CLIENT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

// 错误严重级别
export enum ErrorSeverity {
  LOW = 'low',       // 不影响功能的轻微错误
  MEDIUM = 'medium', // 影响部分功能
  HIGH = 'high',     // 影响主要功能
  CRITICAL = 'critical', // 系统级错误
}

// 自定义错误接口
export interface AppError {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  code?: string
  details?: Record<string, unknown>
  timestamp: string
  stack?: string
}

// 错误配置映射
const ERROR_CONFIG: Record<ErrorType, { severity: ErrorSeverity; defaultMessage: string }> = {
  [ErrorType.NETWORK]: { severity: ErrorSeverity.HIGH, defaultMessage: '网络连接失败，请检查网络设置' },
  [ErrorType.VALIDATION]: { severity: ErrorSeverity.LOW, defaultMessage: '数据验证失败，请检查输入' },
  [ErrorType.AUTHENTICATION]: { severity: ErrorSeverity.HIGH, defaultMessage: '请先登录' },
  [ErrorType.AUTHORIZATION]: { severity: ErrorSeverity.HIGH, defaultMessage: '没有权限执行此操作' },
  [ErrorType.NOT_FOUND]: { severity: ErrorSeverity.MEDIUM, defaultMessage: '请求的资源不存在' },
  [ErrorType.SERVER]: { severity: ErrorSeverity.CRITICAL, defaultMessage: '服务器错误，请稍后重试' },
  [ErrorType.CLIENT]: { severity: ErrorSeverity.MEDIUM, defaultMessage: '操作失败，请重试' },
  [ErrorType.UNKNOWN]: { severity: ErrorSeverity.MEDIUM, defaultMessage: '发生未知错误' },
}

/**
 * 创建应用错误对象
 */
export function createAppError(
  type: ErrorType,
  message?: string,
  details?: Record<string, unknown>
): AppError {
  const config = ERROR_CONFIG[type]
  return {
    type,
    severity: config.severity,
    message: message || config.defaultMessage,
    timestamp: new Date().toISOString(),
    details,
    stack: new Error().stack,
  }
}

/**
 * 从 HTTP 响应创建错误
 */
export function createErrorFromResponse(response: Response, customMessage?: string): AppError {
  const status = response.status

  if (status === 401) {
    return createAppError(ErrorType.AUTHENTICATION, customMessage)
  }
  if (status === 403) {
    return createAppError(ErrorType.AUTHORIZATION, customMessage)
  }
  if (status === 404) {
    return createAppError(ErrorType.NOT_FOUND, customMessage)
  }
  if (status >= 500) {
    return createAppError(ErrorType.SERVER, customMessage)
  }
  if (status >= 400) {
    return createAppError(ErrorType.CLIENT, customMessage)
  }

  return createAppError(ErrorType.UNKNOWN, customMessage)
}

/**
 * 从错误对象创建 AppError
 */
export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }

  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    }
  }

  if (typeof error === 'string') {
    return createAppError(ErrorType.UNKNOWN, error)
  }

  return createAppError(ErrorType.UNKNOWN, '发生未知错误', { originalError: error })
}

/**
 * 类型守卫：检查是否为 AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'severity' in error &&
    'message' in error &&
    'timestamp' in error
  )
}

/**
 * 错误日志记录器
 */
class ErrorLogger {
  private logs: AppError[] = []
  private maxLogs = 100

  /**
   * 记录错误
   */
  log(error: AppError): void {
    this.logs.unshift(error)

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // 控制台输出（开发环境）
    if (process.env.NODE_ENV === 'development') {
      const logMethod = error.severity === ErrorSeverity.CRITICAL ? console.error : console.warn
      logMethod(`[${error.type}] ${error.message}`, {
        severity: error.severity,
        details: error.details,
        timestamp: error.timestamp,
      })
    }

    // 可以在这里添加上报到监控系统的逻辑
    this.reportToMonitoring(error)
  }

  /**
   * 上报到监控系统（可扩展）
   */
  private reportToMonitoring(error: AppError): void {
    // TODO: 集成 Sentry、LogRocket 等监控工具
    // 示例：Sentry.captureException(error)
  }

  /**
   * 获取所有日志
   */
  getLogs(): AppError[] {
    return [...this.logs]
  }

  /**
   * 清空日志
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * 获取特定类型的错误日志
   */
  getLogsByType(type: ErrorType): AppError[] {
    return this.logs.filter((log) => log.type === type)
  }

  /**
   * 获取特定严重级别的错误日志
   */
  getLogsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.logs.filter((log) => log.severity === severity)
  }
}

// 全局错误日志实例
export const errorLogger = new ErrorLogger()

/**
 * 统一错误处理器
 * @param error - 原始错误对象
 * @param context - 错误上下文信息
 * @returns 标准化的 AppError
 */
export function handleError(error: unknown, context?: string): AppError {
  const appError = normalizeError(error)

  // 添加上下文信息
  if (context) {
    appError.details = {
      ...appError.details,
      context,
    }
  }

  // 记录错误
  errorLogger.log(appError)

  return appError
}

/**
 * 异步错误包装器
 * 包装异步函数，自动捕获并处理错误
 */
export function asyncErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  errorHandler?: (error: AppError) => void
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      const appError = handleError(error, fn.name)
      if (errorHandler) {
        errorHandler(appError)
      }
      throw appError
    }
  }) as T
}

/**
 * 获取用户友好的错误消息
 */
export function getUserFriendlyMessage(error: AppError | unknown): string {
  if (isAppError(error)) {
    return error.message
  }

  const normalizedError = normalizeError(error)
  return normalizedError.message
}

/**
 * 检查错误是否可重试
 */
export function isRetryableError(error: AppError): boolean {
  return (
    error.type === ErrorType.NETWORK ||
    error.type === ErrorType.SERVER ||
    error.severity === ErrorSeverity.LOW
  )
}

/**
 * 错误处理工具对象
 */
export const errorHandler = {
  handle: handleError,
  create: createAppError,
  fromResponse: createErrorFromResponse,
  normalize: normalizeError,
  getUserFriendlyMessage,
  isRetryable: isRetryableError,
  wrapAsync: asyncErrorHandler,
  logger: errorLogger,
  ErrorType,
  ErrorSeverity,
}
