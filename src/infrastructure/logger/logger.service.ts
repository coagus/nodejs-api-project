import logger from './winston.config';

export class LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private formatMessage(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }

  error(message: string, error?: Error | unknown): void {
    if (error instanceof Error) {
      logger.error(this.formatMessage(message), { stack: error.stack });
    } else if (error) {
      logger.error(this.formatMessage(message), { error });
    } else {
      logger.error(this.formatMessage(message));
    }
  }

  warn(message: string, meta?: object): void {
    logger.warn(this.formatMessage(message), meta);
  }

  info(message: string, meta?: object): void {
    logger.info(this.formatMessage(message), meta);
  }

  debug(message: string, meta?: object): void {
    logger.debug(this.formatMessage(message), meta);
  }

  // Métodos específicos para diferentes tipos de logs
  logRequest(method: string, url: string, statusCode: number, responseTime: number): void {
    this.info(`${method} ${url} - ${statusCode} - ${responseTime}ms`);
  }

  logDatabaseQuery(query: string, duration: number): void {
    this.debug(`DB Query executed in ${duration}ms: ${query}`);
  }

  logValidationError(field: string, value: unknown, rule: string): void {
    this.warn(`Validation failed - Field: ${field}, Value: ${value}, Rule: ${rule}`);
  }

  logAuthAttempt(usuario: string, success: boolean, ip?: string): void {
    const status = success ? 'SUCCESS' : 'FAILED';
    const ipInfo = ip ? ` from ${ip}` : '';
    this.info(`Auth attempt ${status} for user: ${usuario}${ipInfo}`);
  }
}

// Instancia global del logger
export const appLogger = new LoggerService('APP');
export const dbLogger = new LoggerService('DATABASE');
export const authLogger = new LoggerService('AUTH');

export default LoggerService;