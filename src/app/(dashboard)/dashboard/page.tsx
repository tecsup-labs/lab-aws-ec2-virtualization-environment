'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Building2, CalendarPlus, UserCheck, ArrowRight, Plus, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';

interface DashboardMetrics {
  totalContacts: number;
  uniqueCompanies: number;
  newThisMonth: number;
  recentContacts: Array<{
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    empresa: string | null;
    cargo: string | null;
    avatar: string | null;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const { data: metrics, isLoading, isError } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/contacts/metrics');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white/40 backdrop-blur-md rounded-3xl border border-destructive/20 p-8 shadow-sm">
        <AlertCircle className="w-12 h-12 text-destructive animate-bounce mb-3" />
        <h2 className="text-xl font-bold text-zinc-900">Error al cargar el panel</h2>
        <p className="text-sm text-zinc-500 mt-2">Por favor, intenta recargar la página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-widest text-primary">Vista de Administración</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mt-1">Dashboard</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">
            Una visión general de tu red de contactos empresariales
          </p>
        </div>
        <Link href="/dashboard/contacts">
          <Button className="font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 rounded-2xl py-5 px-6.5 transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-primary via-indigo-600 to-indigo-500 hover:from-primary hover:to-indigo-600 text-white border border-indigo-400/20">
            <Plus className="h-4.5 w-4.5" />
            <span>Gestionar Contactos</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards Grid (Using Premium Light Glassmorphism) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1: Total Contacts */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.05 }}
          className="rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300 p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-450">Total Contactos</span>
            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-2.5 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-10 w-20 bg-zinc-200/60 animate-pulse rounded-2xl" />
            ) : (
              <div className="text-4xl font-black tracking-tight text-zinc-900">
                {metrics?.totalContacts}
              </div>
            )}
            <p className="text-xs font-semibold text-zinc-500 mt-2">
              Contactos activos en tu cuenta
            </p>
          </div>
        </motion.div>

        {/* Metric 2: Unique Companies */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300 p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-450">Empresas Activas</span>
            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-2.5 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-10 w-20 bg-zinc-200/60 animate-pulse rounded-2xl" />
            ) : (
              <div className="text-4xl font-black tracking-tight text-zinc-900">
                {metrics?.uniqueCompanies}
              </div>
            )}
            <p className="text-xs font-semibold text-zinc-500 mt-2">
              Organizaciones asociadas registradas
            </p>
          </div>
        </motion.div>

        {/* Metric 3: Added This Month */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.15 }}
          className="rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300 p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-450">Nuevos este mes</span>
            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-2.5 text-primary">
              <CalendarPlus className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-10 w-20 bg-zinc-200/60 animate-pulse rounded-2xl" />
            ) : (
              <div className="text-4xl font-black tracking-tight text-zinc-900">
                {metrics?.newThisMonth}
              </div>
            )}
            <p className="text-xs font-semibold text-zinc-500 mt-2">
              Agregados en los últimos 30 días
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Additions Card List */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-zinc-900">Novedades Recientes</h3>
              <p className="text-xs font-semibold text-zinc-500 mt-1">Los últimos contactos agregados a tu libreta</p>
            </div>
            <Link href="/dashboard/contacts" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Ver todos</span>
              <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
            </Link>
          </div>

          <div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-4 py-3 border-b border-zinc-200/30">
                    <div className="h-10 w-10 bg-zinc-200/60 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-zinc-200/60 rounded animate-pulse" />
                      <div className="h-3 w-48 bg-zinc-200/60 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : metrics?.recentContacts && metrics.recentContacts.length > 0 ? (
              <div className="divide-y divide-zinc-200/30">
                {metrics.recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group transition-all duration-300">
                    {/* Avatar */}
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={`${contact.nombre} ${contact.apellido}`}
                        className="h-10 w-10 rounded-full object-cover border border-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-black border border-primary/10 text-xs shadow-sm">
                        {contact.nombre.charAt(0).toUpperCase()}
                        {contact.apellido.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold truncate text-zinc-800 group-hover:text-primary transition-colors">
                        {contact.nombre} {contact.apellido}
                      </h4>
                      <p className="text-xs text-zinc-500 font-semibold truncate mt-0.5">
                        {contact.cargo ? `${contact.cargo} en ` : ''}
                        {contact.empresa && <span className="font-extrabold text-zinc-700">{contact.empresa}</span>}
                      </p>
                    </div>
                    {/* Access Date */}
                    <span className="text-[11px] text-zinc-450 font-bold tabular-nums bg-zinc-200/30 px-2.5 py-1 rounded-lg border border-zinc-200/20">
                      {new Date(contact.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-white/20 border border-dashed border-zinc-300 rounded-3xl p-6">
                <UserCheck className="h-9 w-9 text-zinc-400 mb-3 animate-pulse" />
                <p className="text-sm font-bold text-zinc-700">Aún no has agregado contactos.</p>
                <Link href="/dashboard/contacts" className="mt-3">
                  <Button variant="link" size="sm" className="font-extrabold text-primary hover:underline">
                    Crear tu primer contacto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dynamic Tip Card (Highly Premium redesign matching sidebar style) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25 }}
          className="rounded-3xl bg-white/40 border border-white/70 backdrop-blur-xl shadow-sm p-6 space-y-6 flex flex-col"
        >
          <div>
            <h3 className="text-lg font-black text-zinc-900">Consejos Rápidos</h3>
            <p className="text-xs font-semibold text-zinc-500 mt-1">Cómo sacar el máximo provecho</p>
          </div>

          <div className="space-y-4 flex-1">
            <div className="p-4 bg-white/70 border border-zinc-200/60 rounded-2xl space-y-1.5 shadow-sm">
              <span className="font-extrabold text-primary text-[10px] uppercase tracking-wider block">
                Vista de Grid Moderno
              </span>
              <p className="text-xs text-zinc-650 font-semibold leading-relaxed">
                Usa el selector de cuadrícula en la sección de contactos para alternar entre una vista de tabla compacta y tarjetas visuales elegantes con avatares.
              </p>
            </div>
            
            <div className="p-4 bg-white/70 border border-zinc-200/60 rounded-2xl space-y-1.5 shadow-sm">
              <span className="font-extrabold text-primary text-[10px] uppercase tracking-wider block">
                Filtros Multicanal
              </span>
              <p className="text-xs text-zinc-650 font-semibold leading-relaxed">
                Busca instantáneamente por nombre, cargo, correo o empresa usando la barra de búsqueda en tiempo real integrada.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
