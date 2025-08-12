import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { appLogger } from '../../infrastructure/logger/logger.service';
import { HTTP_STATUS } from '../../shared/constants/http-status';
import { ERROR_MESSAGES } from '../../shared/constants/error-messages';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createApiError = (message: string, statusCode: number = 500): ApiError => {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  let details: unknown = undefined;

  // Log del error
  appLogger.error(`Error en ${req.method} ${req.path}:`, error);

  // Error de validación con Zod
  if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
    details = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }
  // Error personalizado de la API
  else if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Error estándar
  else {
    message = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }

  const errorResponse = {
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  res.status(statusCode).json(errorResponse);
};