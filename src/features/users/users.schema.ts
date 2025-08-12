import { relations } from 'drizzle-orm';
import {
  foreignKey,
  index,
  int,
  mysqlTable,
  timestamp,
  tinyint,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 254 }).notNull(),
  email: varchar('email', { length: 254 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  active: tinyint('active').default(1).notNull().$type<0 | 1>(),
  loginAt: timestamp('login_at'),
  createAt: timestamp('create_at').defaultNow().notNull(),
  createBy: int('create_by').notNull(),
  updateAt: timestamp('update_at'),
  updateBy: int('update_by'),
  deleteAt: timestamp('delete_at'),
  deleteBy: int('delete_by'),
});

// Índices
export const usersIndexes = {
  updateByIdx: index('fk_users_update_users_idx').on(users.updateBy),
  createByIdx: index('fk_users_create_users_idx').on(users.createBy),
  deleteByIdx: index('fk_users_delete_users_idx').on(users.deleteBy),
};

// Foreign keys
export const usersForeignKeys = {
  updateByFk: foreignKey({
    columns: [users.updateBy],
    foreignColumns: [users.id],
    name: 'fk_users_update_users',
  }),
  createByFk: foreignKey({
    columns: [users.createBy],
    foreignColumns: [users.id],
    name: 'fk_users_create_users',
  }),
  deleteByFk: foreignKey({
    columns: [users.deleteBy],
    foreignColumns: [users.id],
    name: 'fk_users_delete_users',
  }),
};

// Relaciones
export const usersRelations = relations(users, ({ one, many }) => ({
  // Relaciones "belongsTo" (muchos a uno)
  // Un usuario pertenece a un creador
  createdByUser: one(users, {
    fields: [users.createBy],
    references: [users.id],
    relationName: 'userCreator',
  }),

  // Un usuario pertenece a quien lo actualizó
  updatedByUser: one(users, {
    fields: [users.updateBy],
    references: [users.id],
    relationName: 'userUpdater',
  }),

  // Un usuario pertenece a quien lo eliminó
  deletedByUser: one(users, {
    fields: [users.deleteBy],
    references: [users.id],
    relationName: 'userDeleter',
  }),

  // Relaciones "hasMany" (uno a muchos)
  // Un usuario puede haber creado muchos otros usuarios
  createdUsers: many(users, {
    relationName: 'userCreator',
  }),

  // Un usuario puede haber actualizado muchos otros usuarios
  updatedUsers: many(users, {
    relationName: 'userUpdater',
  }),

  // Un usuario puede haber eliminado muchos otros usuarios
  deletedUsers: many(users, {
    relationName: 'userDeleter',
  }),
}));

export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;
export type UpdateUser = Partial<CreateUser>;