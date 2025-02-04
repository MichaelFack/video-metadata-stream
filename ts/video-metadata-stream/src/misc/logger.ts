export interface ILogger {
  debug(message: string): void;
  verbose(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class Logger implements ILogger {
  private logLevel: LogLevel;
  private context: string;

  constructor(logLevel: LogLevel, context: string) {
    this.logLevel = logLevel;
    this.context = context;
  }

  debug(message: string): void {
    if (this.logLevel == LogLevel.DEBUG) {
      console.log('DEBUG[' + this.context + ']: ' + message);
    }
  }

  verbose(message: string): void {
    if (this.logLevel == LogLevel.DEBUG ||
        this.logLevel == LogLevel.VERBOSE) {
      console.log('VERBOSE[' + this.context + ']: ' + message);
    }
  }

  info(message: string): void {
    if (this.logLevel == LogLevel.DEBUG ||
      this.logLevel == LogLevel.VERBOSE ||
      this.logLevel == LogLevel.INFO) {
      console.log('INFO[' + this.context + ']: ' + message);
    }
  }

  warn(message: string): void {
    if (this.logLevel == LogLevel.DEBUG || this.logLevel == LogLevel.VERBOSE || this.logLevel == LogLevel.INFO || this.logLevel == LogLevel.WARN) {
      console.log('WARN[' + this.context + ']: ' + message);
    }
  }

  error(message: string): void {
    console.log('ERROR[' + this.context + ']: ' + message);
  }
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',  
  DEBUG = 'debug'
}
