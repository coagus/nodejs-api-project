import winston from 'winston';
import { env, isDevelopment } from '../config/environment.config';
import path from 'path';
import fs from 'fs';

// Crear el directorio de logs si no existe
const logsDir = path.dirname(env.LOG_FILE_PATH);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Formato personalizado para los logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
  })
);

// Configuración de transports
const transports: winston.transport[] = [
  // Archivo para todos los logs
  new winston.transports.File({
    filename: env.LOG_FILE_PATH,
    level: env.LOG_LEVEL,
    format: logFormat,
    maxsize: env.LOG_MAX_SIZE,
    maxFiles: env.LOG_MAX_FILES,
  }),
  
  // Archivo específico para errores
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: env.LOG_MAX_SIZE,
    maxFiles: env.LOG_MAX_FILES,
  }),
];

// En desarrollo, también logear a la consola
if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    })
  );
}

// Crear el logger
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  transports,
  exitOnError: false,
});

export default logger;