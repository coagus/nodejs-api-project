import { z } from 'zod';

export const createUserScheme = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario debe tener menos de 50 caracteres')
    .toLowerCase()
    .trim(),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no es válido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'
    )
    .trim(),
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres')
    .trim()
    .optional()
    .nullable(),
});

// Tipo TypeScript derivado del schema
export type CreateUserDto = z.infer<typeof createUserScheme>;
