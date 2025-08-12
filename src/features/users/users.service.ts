import { ApiResponse } from '@/shared/types/api.types';
import { usersRepository } from './users.repository';
import { PublicUserData } from './users.types';
import { CreateUserDto } from './users.dto';

export const usersService = {
  findAll: async (): Promise<ApiResponse<PublicUserData[]>> => {
    const users = await usersRepository.findAll();
    return {
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    };
  },
  findById: async (id: number): Promise<ApiResponse<PublicUserData>> => {
    const user = await usersRepository.findById(id);
    return {
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    };
  },
  create: async (user: CreateUserDto): Promise<ApiResponse<PublicUserData>> => {
    const createdUser = await usersRepository.create(user);
    return {
      success: true,
      data: createdUser,
      timestamp: new Date().toISOString(),
    };
  },
  update: async (id: number, user: CreateUserDto): Promise<ApiResponse<PublicUserData>> => {
    const updatedUser = await usersRepository.update(id, user);
    return {
      success: true,
      data: updatedUser,
      timestamp: new Date().toISOString(),
    };
  },
  delete: async (id: number): Promise<ApiResponse<boolean>> => {
    const deleted = await usersRepository.delete(id);

    if (!deleted) {
      throw new Error('Error al eliminar usuario: No se pudo eliminar el registro');
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  },
};
