'use client';

import { useTheme } from 'next-themes';
import { Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme('light');
  }, [setTheme]);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-md bg-secondary animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme('light')}
      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40 transition-all duration-200"
      aria-label="Light theme"
    >
      <Sun className="h-[18px] w-[18px] transition-all rotate-0 scale-100" />
    </button>
  );
}
