'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Gem } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('cargando...');

  // Fetch logged-in user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user.nombre);
          setUserEmail(data.user.email);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Sesión cerrada correctamente');
      queryClient.clear();
      router.push('/auth/login');
      router.refresh();
    },
    onError: () => {
      toast.error('Error al cerrar sesión');
    },
  });

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/contacts', label: 'Contactos', icon: Users },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-64 border-r border-zinc-200/80 bg-zinc-50/50 backdrop-blur-xl h-screen sticky top-0 text-zinc-900 select-none',
        className
      )}
    >
      {/* Brand logo (Matches our login layout) */}
      <div className="flex h-20 items-center border-b border-zinc-200/80 px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold tracking-tight text-zinc-900">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-400 p-0.5 shadow-md shadow-primary/20">
            <div className="absolute inset-0 rounded-[10px] bg-white opacity-95"></div>
            <Gem className="h-4.5 w-4.5 text-primary z-10 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-zinc-900 leading-none">ContactFlow</span>
            <span className="text-[8px] uppercase font-black tracking-widest text-primary/80 mt-1">Enterprise</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 group relative border border-transparent',
                isActive
                  ? 'bg-white border-zinc-200/80 text-primary shadow-sm'
                  : 'text-zinc-500 hover:bg-white/50 hover:text-zinc-900'
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-zinc-400 group-hover:text-zinc-900")} />
              <span>{link.label}</span>
              {isActive && (
                <div className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="border-t border-zinc-200/80 p-4 space-y-3 bg-zinc-100/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/60 border border-zinc-200/60 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-xs font-extrabold truncate text-zinc-800">{userName}</span>
            <span className="text-[9px] font-semibold text-zinc-450 truncate mt-0.5">{userEmail}</span>
          </div>
        </div>

        <button
          onClick={() => logoutMutation.mutate()}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-zinc-500 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-300 border border-transparent"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
