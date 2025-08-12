import { env, isDevelopment } from '@/infrastructure/config/environment.config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Crear el pool de conexiones
export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
});

// Crear la instancia de Drizzle
export const db = drizzle(pool, {
  logger: isDevelopment, // Esto mostrará todos los queries en consola
  mode: 'default',
});

// Función para verificar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    return false;
  }
};

// Función para cerrar todas las conexiones
export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error cerrando las conexiones:', error);
  }
};