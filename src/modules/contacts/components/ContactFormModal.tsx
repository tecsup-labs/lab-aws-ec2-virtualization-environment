'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { createContactSchema, CreateContactSchemaType } from '../validations/contact.schema';
import { ContactDTO } from '../types/contact.types';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingContact: ContactDTO | null;
}

export default function ContactFormModal({ isOpen, onClose, editingContact }: ContactFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editingContact;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactSchemaType>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      empresa: '',
      cargo: '',
      avatar: '',
      notas: '',
    },
  });

  // Pre-populate form when editing changes
  useEffect(() => {
    if (editingContact) {
      reset({
        nombre: editingContact.nombre,
        apellido: editingContact.apellido,
        correo: editingContact.correo,
        telefono: editingContact.telefono || '',
        empresa: editingContact.empresa || '',
        cargo: editingContact.cargo || '',
        avatar: editingContact.avatar || '',
        notas: editingContact.notas || '',
      });
    } else {
      reset({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        empresa: '',
        cargo: '',
        avatar: '',
        notas: '',
      });
    }
  }, [editingContact, reset, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: CreateContactSchemaType) => {
      const url = isEditing ? `/api/contacts/${editingContact.id}` : '/api/contacts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al guardar el contacto');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Contacto actualizado con éxito' : 'Contacto creado con éxito');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Algo salió mal al guardar el contacto');
    },
  });

  const onSubmit = (data: CreateContactSchemaType) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Contacto' : 'Crear Contacto'}
      description={
        isEditing
          ? 'Modifica los campos del contacto de forma segura.'
          : 'Completa los campos para registrar un nuevo contacto en tu cuenta.'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Nombre *
            </label>
            <Input
              type="text"
              placeholder="Guillermo"
              {...register('nombre')}
              className={errors.nombre ? 'border-destructive/80 focus-visible:ring-destructive/40' : ''}
            />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>

          {/* Apellido */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Apellido *
            </label>
            <Input
              type="text"
              placeholder="Rauch"
              {...register('apellido')}
              className={errors.apellido ? 'border-destructive/80 focus-visible:ring-destructive/40' : ''}
            />
            {errors.apellido && <p className="text-xs text-destructive">{errors.apellido.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Correo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Correo Electrónico *
            </label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              {...register('correo')}
              className={errors.correo ? 'border-destructive/80 focus-visible:ring-destructive/40' : ''}
            />
            {errors.correo && <p className="text-xs text-destructive">{errors.correo.message}</p>}
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Teléfono
            </label>
            <Input type="text" placeholder="+1 (555) 000-0000" {...register('telefono')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Empresa */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Empresa
            </label>
            <Input type="text" placeholder="Vercel" {...register('empresa')} />
          </div>

          {/* Cargo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Cargo / Puesto
            </label>
            <Input type="text" placeholder="CEO" {...register('cargo')} />
          </div>
        </div>

        {/* Avatar URL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            URL del Avatar (Foto)
          </label>
          <Input
            type="text"
            placeholder="https://images.unsplash.com/photo-..."
            {...register('avatar')}
            className={errors.avatar ? 'border-destructive/80 focus-visible:ring-destructive/40' : ''}
          />
          {errors.avatar && <p className="text-xs text-destructive">{errors.avatar.message}</p>}
        </div>

        {/* Notas */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Notas / Comentarios
          </label>
          <textarea
            rows={3}
            placeholder="Detalles sobre este contacto o recordatorios de reuniones..."
            {...register('notas')}
            className="flex w-full rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={saveMutation.isPending}>
            {isEditing ? 'Guardar Cambios' : 'Crear Contacto'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
