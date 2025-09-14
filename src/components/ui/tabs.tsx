import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  className?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, ...props }, ref) => (
  <RadixTabs.Root ref={ref} className={cn('w-full', className)} {...props} />
));
Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  className?: string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cn(
      'inline-flex gap-2 bg-muted/60 rounded-md p-1 w-fit',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  className?: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(
      'h-7 px-3 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[disabled]:opacity-50 data-[disabled]:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  className?: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn('pt-4', className)}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent'; 