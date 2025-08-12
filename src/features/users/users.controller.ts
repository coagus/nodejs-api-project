import { appLogger } from '@/infrastructure/logger/logger.service';
import { HTTP_STATUS } from '@/shared/constants/http-status';
import { FindByIdDto, findByIdScheme } from '@/shared/dtos/db.dtos';
import { NextFunction, Request, Response } from 'express';
import { createUserScheme } from './users.dto';
import { usersService } from './users.service';

export const usersController = {
  // GET /api/v1/users
  findAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await usersService.findAll();
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      appLogger.error('Error al obtener los usuarios', error);
      next(error);
    }
  },
  // GET /api/v1/users/:id
  findById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = findByIdScheme.parse(req.params) as FindByIdDto;
      const response = await usersService.findById(Number(id));      
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      appLogger.error('Error al obtener el usuario', error);
      next(error);
    }
  },
  // POST /api/v1/users
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = createUserScheme.parse(req.body);
      const response = await usersService.create(user);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      appLogger.error('Error al crear el usuario', error);
      next(error);
    }
  },
  // PUT /api/v1/users/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = findByIdScheme.parse(req.params) as FindByIdDto;
      const user = createUserScheme.parse(req.body);
      const response = await usersService.update(Number(id), user);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      appLogger.error('Error al actualizar el usuario', error);
      next(error);
    }
  },
  // DELETE /api/v1/users/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = findByIdScheme.parse(req.params) as FindByIdDto;
      const response = await usersService.delete(Number(id));
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      appLogger.error('Error al eliminar el usuario', error);
      next(error);
    }
  },
};
