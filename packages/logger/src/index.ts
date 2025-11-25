export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? "info";
    this.prefix = options.prefix ?? "";
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private formatMessage(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      this.prefix ? `[${this.prefix}]` : "",
      entry.context ? `[${entry.context}]` : "",
      entry.message,
    ].filter(Boolean);

    return parts.join(" ");
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case "debug":
        console.debug(formattedMessage, data ?? "");
        break;
      case "info":
        console.info(formattedMessage, data ?? "");
        break;
      case "warn":
        console.warn(formattedMessage, data ?? "");
        break;
      case "error":
        console.error(formattedMessage, data ?? "");
        break;
    }
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log("debug", message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log("info", message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log("warn", message, context, data);
  }

  error(message: string, context?: string, data?: unknown): void {
    this.log("error", message, context, data);
  }

  child(prefix: string): Logger {
    return new Logger({
      level: this.level,
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
    });
  }
}

export const logger = new Logger();
