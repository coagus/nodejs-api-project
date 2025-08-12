import { env } from "@/infrastructure/config/environment.config";
import { appLogger } from "@/infrastructure/logger/logger.service";
import { initializeApp, app } from "./app";

const startServer = async (): Promise<void> => {
  try {
    // Inicializar la aplicación (verificar DB, etc.)
    await initializeApp();

    // Iniciar el servidor HTTP
    const server = app.listen(env.PORT, () => {
      appLogger.info(`🚀 Servidor iniciado exitosamente`);
      appLogger.info(`📍 URL: http://localhost:${env.PORT}`);
      appLogger.info(`🌍 Entorno: ${env.NODE_ENV}`);
      appLogger.info(`📖 API Version: ${env.API_VERSION}`);
      appLogger.info(`🩺 Health Check: http://localhost:${env.PORT}/health`);
      appLogger.info(`📚 API Base: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
    });

    // Configurar timeout del servidor
    server.timeout = 30000;

  } catch (error) {
    appLogger.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor si este archivo se ejecuta directamente
if (require.main === module) {
  startServer().catch((error) => {
    appLogger.error('❌ Error crítico:', error);
    process.exit(1);
  });
}