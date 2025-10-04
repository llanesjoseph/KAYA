/**
 * Console Logger - Captures console logs for bug reporting
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  args: any[];
}

class ConsoleLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs
  private isInitialized = false;

  initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Store original console methods
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    // Override console methods to capture logs
    const captureLog = (level: LogLevel, originalMethod: any) => {
      return (...args: any[]) => {
        // Call original method
        originalMethod.apply(console, args);

        // Capture the log
        this.addLog(level, args);
      };
    };

    console.log = captureLog('log', originalConsole.log);
    console.info = captureLog('info', originalConsole.info);
    console.warn = captureLog('warn', originalConsole.warn);
    console.error = captureLog('error', originalConsole.error);
    console.debug = captureLog('debug', originalConsole.debug);

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.addLog('error', [
        `Unhandled Error: ${event.message}`,
        `File: ${event.filename}:${event.lineno}:${event.colno}`,
        event.error,
      ]);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.addLog('error', ['Unhandled Promise Rejection:', event.reason]);
    });

    this.isInitialized = true;
    console.log('🐛 Console logger initialized');
  }

  private addLog(level: LogLevel, args: any[]) {
    const entry: LogEntry = {
      level,
      message: this.formatMessage(args),
      timestamp: new Date().toISOString(),
      args: this.serializeArgs(args),
    };

    this.logs.push(entry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private formatMessage(args: any[]): string {
    return args
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ');
  }

  private serializeArgs(args: any[]): any[] {
    return args.map((arg) => {
      if (arg instanceof Error) {
        return {
          name: arg.name,
          message: arg.message,
          stack: arg.stack,
        };
      }
      try {
        // Try to serialize, but handle circular references
        return JSON.parse(JSON.stringify(arg));
      } catch {
        return String(arg);
      }
    });
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsAsText(): string {
    return this.logs
      .map((log) => {
        const time = new Date(log.timestamp).toLocaleTimeString();
        return `[${time}] [${log.level.toUpperCase()}] ${log.message}`;
      })
      .join('\n');
  }

  clearLogs() {
    this.logs = [];
  }
}

// Singleton instance
export const consoleLogger = new ConsoleLogger();

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  consoleLogger.initialize();
}
