import * as React from 'react';

interface FormSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Override the title-row bottom spacing (defaults to `mb-6`). */
  headerClassName?: string;
  /**
   * Drop the outer card chrome (border + rounded + padding) so the section
   * can render as a plain content block inside a parent card — used when
   * the FormSection lives inside a tabbed wrapper that already provides
   * the card surface.
   */
  borderless?: boolean;
  /**
   * Optional control rendered on the right-hand side of the title row
   * (e.g. a toggle or action button), vertically aligned with the title.
   */
  action?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className, borderless, action, headerClassName }) => (
  <section
    className={[
      borderless ? '' : 'border border-border rounded-xl p-6',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div className={['flex items-center justify-between gap-4', headerClassName || 'mb-6'].join(' ')}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
    <div>{children}</div>
  </section>
);