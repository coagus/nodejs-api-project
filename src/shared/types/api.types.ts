// Respuesta estándar de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
    stack?: string;
  };
  timestamp: string;
  path?: string;
  method?: string;
}
