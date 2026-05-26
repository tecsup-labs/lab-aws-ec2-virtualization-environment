'use client';

import { Edit2, Trash2, Mail, Phone, Building } from 'lucide-react';
import { ContactDTO } from '../types/contact.types';
import { Button } from '@/shared/ui/button';

interface ContactTableProps {
  contacts: ContactDTO[];
  isLoading: boolean;
  onEdit: (contact: ContactDTO) => void;
  onDelete: (id: string) => void;
}

export default function ContactTable({ contacts, isLoading, onEdit, onDelete }: ContactTableProps) {
  if (isLoading) {
    return (
      <div className="w-full border border-white/70 rounded-3xl bg-white/40 backdrop-blur-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/50 bg-white/60">
              <th className="p-4 pl-6 text-xs font-black uppercase tracking-wider text-zinc-450">Contacto</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-zinc-450">Empresa / Cargo</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-zinc-450">Correo</th>
              <th className="p-4 text-xs font-black uppercase tracking-wider text-zinc-450">Teléfono</th>
              <th className="p-4 pr-6 text-right text-xs font-black uppercase tracking-wider text-zinc-450">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/20">
            {[1, 2, 3, 4].map((n) => (
              <tr key={n} className="bg-white/10">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-zinc-200/60 rounded-full animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-zinc-200/60 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-zinc-200/60 rounded animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-zinc-200/60 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-zinc-200/60 rounded animate-pulse" />
                  </div>
                </td>
                <td className="p-4"><div className="h-4 w-40 bg-zinc-200/60 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-28 bg-zinc-200/60 rounded animate-pulse" /></td>
                <td className="p-4 pr-6 text-right"><div className="h-8 w-16 bg-zinc-200/60 rounded-lg ml-auto animate-pulse" /></td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="w-full border border-white/70 rounded-3xl bg-white/40 backdrop-blur-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-200/60 bg-white/60 text-xs font-black uppercase tracking-wider text-zinc-450">
              <th className="p-4.5 pl-6">Contacto</th>
              <th className="p-4.5">Organización</th>
              <th className="p-4.5">Email</th>
              <th className="p-4.5">Teléfono</th>
              <th className="p-4.5 pr-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/20 text-sm">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-white/60 transition-all duration-200 group">
                {/* Contact name & avatar */}
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={`${contact.nombre} ${contact.apellido}`}
                        className="h-9 w-9 rounded-full object-cover border border-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase shadow-sm">
                        {contact.nombre.charAt(0)}
                        {contact.apellido.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-zinc-800 group-hover:text-primary transition-colors">
                        {contact.nombre} {contact.apellido}
                      </div>
                      {contact.notas && (
                        <div className="text-[10px] text-zinc-400 font-semibold line-clamp-1 max-w-[200px]" title={contact.notas}>
                          {contact.notas}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Company & Cargo */}
                <td className="p-4">
                  {contact.empresa || contact.cargo ? (
                    <div>
                      <div className="font-bold text-zinc-700 flex items-center gap-1.5">
                        {contact.empresa && <Building className="h-3.5 w-3.5 text-zinc-400" />}
                        <span>{contact.empresa || 'Individual'}</span>
                      </div>
                      {contact.cargo && (
                        <div className="text-xs text-zinc-450 font-semibold mt-0.5">{contact.cargo}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-350 font-semibold">—</span>
                  )}
                </td>

                {/* Email */}
                <td className="p-4">
                  <a
                    href={`mailto:${contact.correo}`}
                    className="flex items-center gap-1.5 text-zinc-500 font-semibold hover:text-primary transition-colors hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate max-w-[180px]">{contact.correo}</span>
                  </a>
                </td>

                {/* Telephone */}
                <td className="p-4">
                  {contact.telefono ? (
                    <a
                      href={`tel:${contact.telefono}`}
                      className="flex items-center gap-1.5 text-zinc-500 font-semibold hover:text-zinc-900 transition-colors hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>{contact.telefono}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-350 font-semibold">—</span>
                  )}
                </td>

                 {/* Actions */}
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(contact)}
                      className="h-8.5 w-8.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/80 border border-indigo-100/50 rounded-xl shadow-xs transition-all duration-300 hover:scale-105 active:scale-95"
                      title="Editar contacto"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(contact.id)}
                      className="h-8.5 w-8.5 text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-100/80 border border-rose-100/50 rounded-xl shadow-xs transition-all duration-300 hover:scale-105 active:scale-95"
                      title="Eliminar contacto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

