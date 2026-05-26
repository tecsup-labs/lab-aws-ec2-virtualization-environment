'use client';

import { Search, LayoutGrid, List, X } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

interface ContactFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onClearFilters: () => void;
}

export default function ContactFilters({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}: ContactFiltersProps) {
  const hasActiveFilters = !!search;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/40 border border-white/70 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-sm">
      {/* Search Input bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
        <Input
          type="text"
          placeholder="Buscar por nombre, correo, empresa, cargo..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-9 py-5 rounded-2xl border-zinc-200/80 bg-white/60 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-zinc-400 placeholder:font-medium text-sm font-semibold"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-900 p-0.5 rounded-full hover:bg-zinc-200/60 transition-all duration-200"
            aria-label="Borrar búsqueda"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Workspace Display Mode & Action Bar */}
      <div className="flex items-center gap-4 justify-end">
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters} 
            className="text-xs font-bold text-zinc-500 hover:text-destructive hover:bg-destructive/5 rounded-xl px-3 py-1.5 transition-colors"
          >
            Limpiar filtros
          </Button>
        )}

        <div className="flex items-center border border-zinc-250/60 rounded-xl p-1 bg-white/80 shadow-inner-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('table')}
            className={`h-8 w-8 rounded-lg transition-all duration-200 ${
              viewMode === 'table' 
                ? 'bg-zinc-100 text-primary shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-800'
            }`}
            title="Vista de Tabla"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={`h-8 w-8 rounded-lg transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-zinc-100 text-primary shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-800'
            }`}
            title="Vista de Tarjetas"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

