import prisma from '@/shared/lib/prisma';
import { CreateContactInput, UpdateContactInput, ContactFiltersInput } from '../types/contact.types';

export class ContactRepository {
  /**
   * Creates a new contact linked to a user.
   */
  async create(userId: string, data: CreateContactInput) {
    return await prisma.contact.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono || null,
        empresa: data.empresa || null,
        cargo: data.cargo || null,
        avatar: data.avatar || null,
        notas: data.notas || null,
        userId: userId,
      },
    });
  }

  /**
   * Finds a contact by ID, scoped to the authenticated user.
   */
  async findById(id: string, userId: string) {
    return await prisma.contact.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Finds all contacts for a user based on search, filtering, and pagination.
   */
  async findAll(userId: string, filters: ContactFiltersInput) {
    const { search, empresa, cargo, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    // Build the query where clause
    const where: any = {
      userId,
    };

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apellido: { contains: search, mode: 'insensitive' } },
        { correo: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } },
        { cargo: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (empresa) {
      where.empresa = { equals: empresa, mode: 'insensitive' };
    }

    if (cargo) {
      where.cargo = { equals: cargo, mode: 'insensitive' };
    }

    // Execute queries in parallel
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: {
          nombre: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.contact.count({
        where,
      }),
    ]);

    return {
      contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Updates an existing contact scoped to the authenticated user.
   */
  async update(id: string, userId: string, data: UpdateContactInput) {
    // Confirm ownership first
    const contact = await this.findById(id, userId);
    if (!contact) {
      throw new Error('Contact not found or unauthorized');
    }

    return await prisma.contact.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono !== undefined ? data.telefono || null : undefined,
        empresa: data.empresa !== undefined ? data.empresa || null : undefined,
        cargo: data.cargo !== undefined ? data.cargo || null : undefined,
        avatar: data.avatar !== undefined ? data.avatar || null : undefined,
        notas: data.notas !== undefined ? data.notas || null : undefined,
      },
    });
  }

  /**
   * Deletes a contact scoped to the authenticated user.
   */
  async delete(id: string, userId: string) {
    // Confirm ownership first
    const contact = await this.findById(id, userId);
    if (!contact) {
      throw new Error('Contact not found or unauthorized');
    }

    return await prisma.contact.delete({
      where: { id },
    });
  }

  /**
   * Aggregates metrics for the user dashboard.
   */
  async getMetrics(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalContacts, uniqueCompanies, newThisMonth, recentContacts] = await Promise.all([
      // Total contacts
      prisma.contact.count({
        where: { userId },
      }),
      // Count unique companies
      prisma.contact.groupBy({
        by: ['empresa'],
        where: {
          userId,
          empresa: { not: null, equals: undefined } // Only filled ones
        },
      }),
      // Added this month
      prisma.contact.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      // Top 5 recent contacts
      prisma.contact.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Filter companies that are empty strings or null
    const companiesCount = uniqueCompanies.filter(c => c.empresa && c.empresa.trim() !== '').length;

    return {
      totalContacts,
      uniqueCompanies: companiesCount,
      newThisMonth,
      recentContacts,
    };
  }
}
export const contactRepository = new ContactRepository();
