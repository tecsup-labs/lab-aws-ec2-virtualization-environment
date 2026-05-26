'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { ContactDTO, ContactListResponse } from '../types/contact.types';
import ContactFilters from '../components/ContactFilters';
import ContactTable from '../components/ContactTable';
import ContactCards from '../components/ContactCards';
import ContactFormModal from '../components/ContactFormModal';
import { AnimatePresence, motion } from 'framer-motion';

export default function ContactsPage() {
  const queryClient = useQueryClient();
  
  // Workspace UI states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // 6 items looks perfect in Grid card layout!
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactDTO | null>(null);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Search Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 350);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch paginated contacts
  const { data, isLoading, isError } = useQuery<ContactListResponse>({
    queryKey: ['contacts', debouncedSearch, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/contacts?${params.toString()}`);
      if (!res.ok) throw new Error('Error al cargar contactos');
      return res.json();
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar contacto');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Contacto eliminado con éxito');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
    onError: () => {
      toast.error('Ocurrió un error al eliminar el contacto');
    },
  });

  const handleEdit = (contact: ContactDTO) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setContactToDelete(id);
  };

  const handleCreateNew = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  };

  const contactsList = data?.contacts || [];
  const totalPages = data?.totalPages || 1;
  const totalContactsCount = data?.total || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title & Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Libreta de Contactos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra, busca y organiza las credenciales de tu red empresarial
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateNew} className="font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 rounded-2xl py-5 px-6.5 transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-primary via-indigo-600 to-indigo-500 hover:from-primary hover:to-indigo-600 text-white border border-indigo-400/20">
            <Plus className="h-4 w-4" />
            <span>Nuevo Contacto</span>
          </Button>
        </div>
      </div>

      {/* Controller Filters Toolbar */}
      <ContactFilters
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
      />

      {/* Error State */}
      {isError && (
        <div className="text-center py-12 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-sm font-semibold text-destructive">Error al cargar la libreta de contactos</p>
          <Button variant="link" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['contacts'] })}>
            Reintentar
          </Button>
        </div>
      )}

      {/* Main Workspace Render */}
      {!isError && (
        <>
          {viewMode === 'table' ? (
            <ContactTable
              contacts={contactsList}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <ContactCards
              contacts={contactsList}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Simple Pagination control footer */}
          {!isLoading && contactsList.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-5 mt-4">
              <span className="text-xs text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{contactsList.length}</span> de{' '}
                <span className="font-semibold text-foreground">{totalContactsCount}</span> contactos
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-2 h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 text-xs">Anterior</span>
                </Button>

                <div className="text-xs font-semibold px-3 py-1 bg-secondary/50 border border-border/30 rounded-lg text-foreground">
                  Pág. {page} de {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-2 h-8"
                >
                  <span className="hidden sm:inline mr-1 text-xs">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Slide-over Form Dialog Popup */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingContact={editingContact}
      />

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {contactToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactToDelete(null)}
              className="absolute inset-0 bg-zinc-950/20 backdrop-blur-md"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white/80 border border-white/70 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 z-10"
            >
              <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs animate-bounce mt-1">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900">¿Eliminar contacto?</h3>
                <p className="text-xs text-zinc-500 font-semibold mt-2 px-2 leading-relaxed">
                  Esta acción es permanente y no se podrá deshacer. El contacto se borrará por completo de tu base de datos empresarial.
                </p>
              </div>
              <div className="flex w-full gap-3 mt-3">
                <Button
                  onClick={() => setContactToDelete(null)}
                  variant="outline"
                  className="flex-1 rounded-2xl py-4 font-bold text-zinc-500 border-zinc-200/80 hover:bg-zinc-50 transition-all"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (contactToDelete) {
                      deleteMutation.mutate(contactToDelete);
                      setContactToDelete(null);
                    }
                  }}
                  className="flex-1 rounded-2xl py-4 font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all"
                >
                  Sí, eliminar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
