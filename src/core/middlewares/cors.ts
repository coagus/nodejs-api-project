import cors from 'cors';
import { env, isDevelopment } from '@/infrastructure/config/environment.config';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // En desarrollo, permitir cualquier origin
    if (isDevelopment) {
      return callback(null, true);
    }

    // En producción, verificar contra la lista de origins permitidos
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
    if (allowedOrigins.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
  ],
};

export const corsMiddleware = cors(corsOptions);
