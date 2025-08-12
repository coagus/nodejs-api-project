import { z } from 'zod';

export const findByIdScheme = z.object({
  id: z.string().regex(/^\d+$/, 'El ID debe ser un número entero positivo'),
});

export type FindByIdDto = z.infer<typeof findByIdScheme>;