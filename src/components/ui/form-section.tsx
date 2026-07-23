import * as React from 'react';

interface FormSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Override the title-row bottom spacing (defaults to `mb-6`). */
  headerClassName?: string;
  /**
   * Opt back into the outer card chrome (border + rounded + padding). Form
   * sections are borderless by default so every form across the templates
   * looks the same — a consistent `text-lg` title with the fields below, no
   * card. Only set this for a rare standalone section not already inside a card.
   */
  bordered?: boolean;
  /**
   * Optional control rendered on the right-hand side of the title row
   * (e.g. a toggle or action button), vertically aligned with the title.
   */
  action?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className, bordered, action, headerClassName }) => (
  <section
    className={[
      bordered ? 'border border-border rounded-xl p-6' : '',
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