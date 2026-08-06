'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';

/**
 * One button, two weights of the same act.
 *
 * Save is what the user does all day; submitting for approval is the same
 * work leaving their hands. Two side-by-side buttons made them look like
 * alternatives — this keeps Save primary and puts the escalation behind the
 * arrow, where it reads as "…and also".
 */
export interface SplitButtonProps {
  label: string;
  onClick?: () => void;
  menu: { label: string; onClick?: () => void }[];
  variant?: ButtonProps['variant'];
  className?: string;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  label,
  onClick,
  menu,
  variant = 'default',
  className,
}) => (
  <div className={cn('inline-flex', className)}>
    <Button variant={variant} onClick={onClick} className="rounded-r-none">
      {label}
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          iconOnly
          aria-label="More actions"
          className="rounded-l-none border-l border-l-primary-foreground/25"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menu.map((m) => (
          <DropdownMenuItem key={m.label} onClick={m.onClick}>
            {m.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
