import usersRouter from '@/features/users/users.routes';
import { env } from '@/infrastructure/config/environment.config';
import { appLogger } from '@/infrastructure/logger/logger.service';
import { Application } from 'express';

export const configureRoutes = (app: Application) => {
  const apiVersion = env.API_VERSION;
  const basePath = `/api/${apiVersion}`;

  app.use(`${basePath}/users`, usersRouter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: env.API_VERSION,
      environment: env.NODE_ENV,
    });
  });

  // Ruta para 404 (sin patrón específico)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      },
      timestamp: new Date().toISOString(),
    });
  });

  appLogger.info(`Rutas configuradas en el path base: ${basePath}`);
};
