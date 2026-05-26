export interface ContactDTO {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  empresa?: string | null;
  cargo?: string | null;
  avatar?: string | null;
  notas?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactInput {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
  avatar?: string;
  notas?: string;
}

export interface UpdateContactInput {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
  avatar?: string;
  notas?: string;
}

export interface ContactFiltersInput {
  search?: string;
  empresa?: string;
  cargo?: string;
  page?: number;
  limit?: number;
}

export interface ContactListResponse {
  contacts: ContactDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
