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
import { useVersion } from '@/contexts/version-context';
import { Code } from 'lucide-react';

export function VersionSwitcher() {
  const { version, setVersion, availableVersions } = useVersion();

  const versionInfo = {
    v1: { name: 'Version 1.0', description: 'Basic MVP features' },
    v2: { name: 'Version 2.0', description: 'Enhanced UX' },
    v3: { name: 'Version 3.0', description: 'AI-powered features' },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Code className="h-4 w-4 mr-2" />
          {version.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Select Version</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableVersions.map((versionOption) => (
          <DropdownMenuItem
            key={versionOption}
            onClick={() => setVersion(versionOption)}
            className="cursor-pointer"
          >
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium">
                  {versionInfo[versionOption]?.name || versionOption}
                </span>
                {version === versionOption && (
                  <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {versionInfo[versionOption]?.description || 'Version description'}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}