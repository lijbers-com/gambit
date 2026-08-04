import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  /** Muted helper line under the field, same as Input's. */
  hint?: string;
}

/**
 * Multi-line text field. Styling deliberately mirrors <Input> — same border,
 * radius, shadow and focus ring — so a form that mixes the two reads as one
 * set of fields.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, hint, ...props }, ref) => (
  <>
    <textarea
      ref={ref}
      {...props}
      className={cn(
        'flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
    />
    {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
  </>
));
Textarea.displayName = 'Textarea';

export { Textarea };
