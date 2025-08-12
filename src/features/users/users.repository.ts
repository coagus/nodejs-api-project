import { db } from '@/infrastructure/config/database.config';
import { dbLogger } from '@/infrastructure/logger/logger.service';
import { and, eq, isNull } from 'drizzle-orm';
import { users } from './users.schema';
import { CreateUserDto } from './users.dto';
import { PublicUserData } from './users.types';

export const usersRepository = {
  findAll: async (): Promise<PublicUserData[]> => {
    const startTime = Date.now();
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(and(eq(users.active, 1), isNull(users.deleteAt)));

    dbLogger.logDatabaseQuery(`users.findAll()`, Date.now() - startTime);

    return result as PublicUserData[];
  },
  findById: async (id: number): Promise<PublicUserData> => {
    const startTime = Date.now();
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(
        and(eq(users.id, id), eq(users.active, 1), isNull(users.deleteAt))
      );
    dbLogger.logDatabaseQuery(`users.findById()`, Date.now() - startTime);
    return result[0] as PublicUserData;
  },
  create: async (user: CreateUserDto): Promise<PublicUserData> => {
    const startTime = Date.now();

    const insertData = {
      ...user,
      createAt: new Date(),
      createBy: 1,
    };

    const [resultHeader] = await db.insert(users).values(insertData);
    const insertId = (resultHeader as any).insertId;
    if (!insertId) {
      throw new Error('Error al crear usuario: No se generó ID');
    }

    const created = await usersRepository.findById(insertId);

    if (!created) {
      throw new Error(
        'Error al crear usuario: No se pudo recuperar el registro creado'
      );
    }

    dbLogger.logDatabaseQuery(`users.create()`, Date.now() - startTime);

    return created;
  },
  update: async (id: number, user: CreateUserDto): Promise<PublicUserData> => {
    const startTime = Date.now();

    const updateData = {
      ...user,
      updateAt: new Date(),
      updateBy: 1,
    };

    const [resultHeader] = await db
      .update(users)
      .set(updateData)
      .where(
        and(eq(users.id, id), eq(users.active, 1), isNull(users.deleteAt))
      );

    if (!resultHeader) {
      throw new Error(
        'Error al actualizar usuario: No se pudo recuperar el registro actualizado'
      );
    }

    const updated = await usersRepository.findById(id);

    dbLogger.logDatabaseQuery(`users.update()`, Date.now() - startTime);
    return updated;
  },
  delete: async (id: number): Promise<boolean> => {
    const startTime = Date.now();
    const [resultHeader] = await db
      .update(users)
      .set({ deleteAt: new Date(), deleteBy: 1 })
      .where(
        and(eq(users.id, id), eq(users.active, 1), isNull(users.deleteAt))
      );
    dbLogger.logDatabaseQuery(`users.delete()`, Date.now() - startTime);
    return resultHeader ? true : false;
  },
};
