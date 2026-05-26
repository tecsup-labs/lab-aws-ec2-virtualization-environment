import { z } from 'zod';

export const createContactSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  correo: z.string().trim().email('Debe ser un correo electrónico válido'),
  telefono: z.string().trim().optional().or(z.literal('')),
  empresa: z.string().trim().optional().or(z.literal('')),
  cargo: z.string().trim().optional().or(z.literal('')),
  avatar: z.string().trim().url('El avatar debe ser una URL válida').optional().or(z.literal('')),
  notas: z.string().trim().optional().or(z.literal('')),
});

export const updateContactSchema = createContactSchema.partial();

export const contactFiltersSchema = z.object({
  search: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  page: z.preprocess((val) => Number(val) || 1, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => Number(val) || 10, z.number().int().min(1).default(10)),
});

export type CreateContactSchemaType = z.infer<typeof createContactSchema>;
export type UpdateContactSchemaType = z.infer<typeof updateContactSchema>;
export type ContactFiltersSchemaType = z.infer<typeof contactFiltersSchema>;
