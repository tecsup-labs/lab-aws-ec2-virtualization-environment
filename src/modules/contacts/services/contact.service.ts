import { contactRepository } from '../repositories/contact.repository';
import { CreateContactInput, UpdateContactInput, ContactFiltersInput } from '../types/contact.types';
import { createContactSchema, updateContactSchema, contactFiltersSchema } from '../validations/contact.schema';

export class ContactService {
  /**
   * Validates and creates a new contact.
   */
  async createContact(userId: string, input: CreateContactInput) {
    // Validate input with Zod
    const validatedData = createContactSchema.parse(input);
    return await contactRepository.create(userId, validatedData);
  }

  /**
   * Retrieves a single contact by ID after verifying ownership.
   */
  async getContactById(id: string, userId: string) {
    const contact = await contactRepository.findById(id, userId);
    if (!contact) {
      throw new Error('Contacto no encontrado o acceso no autorizado');
    }
    return contact;
  }

  /**
   * Validates filters and retrieves a paginated, filtered list of contacts.
   */
  async getContacts(userId: string, filters: ContactFiltersInput) {
    const validatedFilters = contactFiltersSchema.parse(filters);
    return await contactRepository.findAll(userId, validatedFilters);
  }

  /**
   * Validates and updates a contact after verifying ownership.
   */
  async updateContact(id: string, userId: string, input: UpdateContactInput) {
    const validatedData = updateContactSchema.parse(input);
    return await contactRepository.update(id, userId, validatedData);
  }

  /**
   * Deletes a contact after verifying ownership.
   */
  async deleteContact(id: string, userId: string) {
    return await contactRepository.delete(id, userId);
  }

  /**
   * Retrieves user-scoped metrics for the dashboard.
   */
  async getDashboardMetrics(userId: string) {
    return await contactRepository.getMetrics(userId);
  }
}

export const contactService = new ContactService();
