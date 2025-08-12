import { createExpressApp } from '@/infrastructure/server/express.config';
import { testConnection } from '@/infrastructure/config/database.config';
import { appLogger } from '@/infrastructure/logger/logger.service';

const app = createExpressApp();

const checkDatabaseConnection = async (): Promise<void> => {
  try {
    appLogger.info('Verificando conexión a la base de datos...');
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      appLogger.info('✅ Conexión a la base de datos establecida exitosamente');
    } else {
      throw new Error('No se pudo establecer conexión con la base de datos');
    }
  } catch (error) {
    appLogger.error('❌ Error de conexión a la base de datos:', error);
    throw error;
  }
};

const initializeApp = async (): Promise<void> => {
  try {
    appLogger.info('🚀 Iniciando API...');
    
    await checkDatabaseConnection();
    
    // Aquí puedes agregar más inicializaciones si es necesario
    // - Conexiones a servicios externos
    // - Carga de datos iniciales
    // - Verificación de migraciones
    
    appLogger.info('✅ Aplicación inicializada correctamente');
  } catch (error) {
    appLogger.error('❌ Error al inicializar la aplicación:', error);
    process.exit(1);
  }
};

export { app, initializeApp };