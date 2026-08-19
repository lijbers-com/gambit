'use client';

import * as React from 'react';
import { Plus, Link2, ListStart, MonitorSpeaker, MonitorPlay, Store, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { TAB_ACTION_LABEL } from './tab-actions';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
import type { EngineId } from '@/lib/db';

/**
 * "Add campaign", asking which proposition — the same question the side
 * navigation's Create menu asks, with the same options and icons, because a
 * campaign always belongs to exactly one proposition and picking it is the
 * first thing the wizard would ask anyway.
 */

const PROPOSITIONS: { engine: EngineId; label: string; href: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { engine: 'sponsored-products', label: 'Sponsored products', href: '/create/sponsored-products', Icon: ListStart },
  { engine: 'display', label: 'Display', href: '/create/display', Icon: MonitorSpeaker },
  { engine: 'digital-instore', label: 'Digital in-store', href: '/create/digital-instore', Icon: MonitorPlay },
  { engine: 'offline-instore', label: 'Offline in-store', href: '/create/offline-instore', Icon: Store },
  { engine: 'offsite', label: 'Offsite', href: '/create/offsite', Icon: Globe },
];

export interface AddCampaignMenuProps {
  /** Called with the chosen proposition. Falls back to the create route. */
  onSelect?: (engine: EngineId) => void;
  label?: string;
  /** Replace the default button — e.g. the table's inline "Add campaign" row
   *  link. The menu behaviour stays identical. */
  trigger?: React.ReactNode;
  /** Offer "Add existing campaign…" under the propositions — a new campaign
   *  and a relinked one are answers to the same question. */
  onAddExisting?: () => void;
  className?: string;
}

export const AddCampaignMenu: React.FC<AddCampaignMenuProps> = ({
  onSelect,
  label = 'Add campaign',
  trigger,
  onAddExisting,
  className,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {trigger ?? (
      <Button className={cn('gap-1.5', className)} title={label}>
        <Plus className="h-4 w-4" />
        <span className={TAB_ACTION_LABEL}>{label}</span>
      </Button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {PROPOSITIONS.map(({ engine, label: name, href, Icon }) => (
        <DropdownMenuItem
          key={engine}
          className="gap-2"
          onClick={() => {
            if (onSelect) onSelect(engine);
            else if (typeof window !== 'undefined') window.location.href = href;
          }}
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
          {name}
        </DropdownMenuItem>
      ))}
      {onAddExisting && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2" onClick={onAddExisting}>
            <Link2 className="h-4 w-4 text-muted-foreground" />
            Add existing campaign…
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
