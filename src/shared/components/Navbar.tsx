'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user.nombre);
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

  // Dynamic breadcrumb mapping
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/contacts') return 'Contactos';
    return 'Panel';
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-md px-6 w-full text-foreground">
        {/* Mobile menu toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="block md:hidden p-1.5 hover:bg-secondary rounded-lg text-muted-foreground transition-all duration-200"
            aria-label="Abrir menú"
          >
            <Menu className="h-[20px] w-[20px]" />
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="text-muted-foreground">Workspace</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground font-semibold">{getPageTitle()}</span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-muted-foreground">
            Hola, <span className="font-semibold text-foreground">{userName}</span>
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs shadow-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Responsive Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-xs transition-opacity duration-300">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-background/40" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-card border-r border-border/40 p-6 shadow-xl animate-in slide-in-from-left duration-300 z-50">
            {/* Close Button */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <span className="font-bold text-foreground">ContactFlow</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:bg-secondary rounded-lg text-muted-foreground transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/contacts"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  pathname === '/dashboard/contacts' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Users className="h-4 w-4" />
                <span>Contactos</span>
              </Link>
            </nav>

            {/* Mobile Footer */}
            <div className="border-t border-border/40 pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutMutation.mutate();
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
