'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';
import type { BackgroundTheme } from './AnimatedBackground';

interface ThemeSwitcherProps {
  currentTheme: BackgroundTheme;
  onThemeChange: (theme: BackgroundTheme) => void;
}

const themes: { value: BackgroundTheme; label: string; color: string }[] = [
  { value: 'cyber', label: 'Cyber', color: 'bg-blue-500' },
  { value: 'aurora', label: 'Aurora', color: 'bg-emerald-500' },
  { value: 'sunset', label: 'Sunset', color: 'bg-orange-500' },
  { value: 'ocean', label: 'Ocean', color: 'bg-cyan-500' },
  { value: 'minimal', label: 'Minimal', color: 'bg-gray-500' },
];

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="glass glass-hover">
          <Palette className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className={currentTheme === theme.value ? 'bg-primary/20' : ''}
          >
            <div className={`w-3 h-3 rounded-full ${theme.color} mr-2`} />
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

