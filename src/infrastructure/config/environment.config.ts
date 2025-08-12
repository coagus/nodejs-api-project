import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config(); // Carga las variables de entorno desde el archivo .env para leer process.env

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default(3000), 
  API_VERSION: z.string().default('v1'),
  API_NAME: z.string().default('Project'),
  // Security
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform((val) => parseInt(val, 10)).default(100),
  // Logs
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE_PATH: z.string().default('logs/app.log'),
  LOG_MAX_SIZE: z.string().transform((val) => parseInt(val, 10)).default(5242880),
  LOG_MAX_FILES: z.string().transform((val) => parseInt(val, 10)).default(5),
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform((val) => parseInt(val, 10)).default(3306),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('db_project_name'),
});

const parseEnv = () => {
  try {
    // Leemos .env y lo parseamos con zod para validar las variables de entorno
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Error de configuración de variables de entorno:', error);
    process.exit(1);
  }
};

export const env = parseEnv();

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';