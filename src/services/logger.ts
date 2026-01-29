/**
 * Simple logging service for error tracking and debugging
 * Can be extended to send errors to a service like Sentry in production
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

class Logger {
  private isDevelopment = (import.meta.env.DEV as boolean) ?? false

  private formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level}: ${entry.message}`
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    const formatted = this.formatLog(entry)

    // Always log in development
    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted, data)
          break
        case LogLevel.INFO:
          console.info(formatted, data)
          break
        case LogLevel.WARN:
          console.warn(formatted, data)
          break
        case LogLevel.ERROR:
          console.error(formatted, data)
          break
      }
    } else {
      // In production, only log warnings and errors
      if (level === LogLevel.WARN || level === LogLevel.ERROR) {
        console.error(formatted, data)
        // TODO: Send to error tracking service (Sentry, etc.)
      }
    }
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, error?: unknown): void {
    const errorData = error instanceof Error ? error.message : String(error)
    this.log(LogLevel.ERROR, message, errorData)
  }
}

// Export singleton instance
export const logger = new Logger()
