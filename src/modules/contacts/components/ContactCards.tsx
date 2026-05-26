'use client';

import { Edit2, Trash2, Mail, Phone, Building2, Briefcase } from 'lucide-react';
import { ContactDTO } from '../types/contact.types';
import { Button } from '@/shared/ui/button';
import { motion } from 'framer-motion';

interface ContactCardsProps {
  contacts: ContactDTO[];
  isLoading: boolean;
  onEdit: (contact: ContactDTO) => void;
  onDelete: (id: string) => void;
}

export default function ContactCards({ contacts, isLoading, onEdit, onDelete }: ContactCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-zinc-200/60 rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-zinc-200/60 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-zinc-200/60 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 pb-2">
              <div className="h-3.5 w-full bg-zinc-200/60 rounded animate-pulse" />
              <div className="h-3.5 w-5/6 bg-zinc-200/60 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-sm">
        <p className="text-sm font-bold text-zinc-500">No se encontraron contactos que coincidan con la búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact, index) => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
        >
          <div>
            {/* Header Info */}
            <div className="flex items-start justify-between gap-2 pb-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={`${contact.nombre} ${contact.apellido}`}
                    className="h-12 w-12 rounded-full object-cover border border-white shadow-sm shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-sm uppercase shadow-sm">
                    {contact.nombre.charAt(0)}
                    {contact.apellido.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-extrabold text-zinc-800 group-hover:text-primary transition-colors truncate">
                    {contact.nombre} {contact.apellido}
                  </h4>
                  
                  {/* Company Badge */}
                  {contact.empresa && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black uppercase tracking-wider bg-white/90 text-zinc-600 px-2.5 py-0.5 rounded-lg border border-zinc-200/50 shadow-sm">
                      <Building2 className="h-2.5 w-2.5 shrink-0 text-zinc-400" />
                      <span className="truncate max-w-[100px]">{contact.empresa}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(contact)}
                  className="h-7.5 w-7.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/80 border border-indigo-100/50 rounded-xl shadow-xs transition-all duration-300 hover:scale-105"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(contact.id)}
                  className="h-7.5 w-7.5 text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-100/80 border border-rose-100/50 rounded-xl shadow-xs transition-all duration-300 hover:scale-105"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-2.5 text-xs">
              {/* Cargo */}
              {contact.cargo && (
                <div className="flex items-center gap-2 text-zinc-500 font-semibold">
                  <Briefcase className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                  <span>{contact.cargo}</span>
                </div>
              )}

              {/* Email */}
              <a
                href={`mailto:${contact.correo}`}
                className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors truncate hover:underline font-semibold"
              >
                <Mail className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                <span>{contact.correo}</span>
              </a>

              {/* Phone */}
              {contact.telefono ? (
                <a
                  href={`tel:${contact.telefono}`}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors hover:underline font-semibold"
                >
                  <Phone className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                  <span>{contact.telefono}</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-zinc-350 font-semibold">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>Sin teléfono</span>
                </div>
              )}

              {/* Notes */}
              {contact.notas && (
                <div className="mt-3.5 p-3 bg-white/70 border border-zinc-200/50 rounded-2xl text-zinc-500 text-[11px] leading-relaxed line-clamp-2 shadow-inner-sm">
                  {contact.notas}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

