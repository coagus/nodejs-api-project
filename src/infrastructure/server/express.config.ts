import { corsMiddleware } from '@/core/middlewares/cors';
import express, { Application } from 'express';
import { errorHandler } from '@/core/middlewares/error-handler';
import { configureRoutes } from './routes.config';

export const createExpressApp = (): Application => {
  const app = express();

  // JSON
  app.use(express.json({ 
    limit: '10mb',
    type: ['application/json', 'text/plain']
  }));

  // URL-encoded
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb'
  }));

  // CORS
  app.use(corsMiddleware);

  // RUTAS
  configureRoutes(app);

  // ERRORES
  app.use(errorHandler);

  return app;
};
