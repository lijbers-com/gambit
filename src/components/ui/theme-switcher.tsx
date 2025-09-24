'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'gambit', name: 'Gambit', description: 'Purple corporate theme' },
    { id: 'albert-heijn', name: 'Albert Heijn', description: 'Blue retail theme' },
    { id: 'adusa', name: 'ADUSA', description: 'ADUSA retail theme' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Palette className="h-4 w-4 mr-2" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id as any)}
            className="cursor-pointer"
          >
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium">{themeOption.name}</span>
                {theme === themeOption.id && (
                  <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {themeOption.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}