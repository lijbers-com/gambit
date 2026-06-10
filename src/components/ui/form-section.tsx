import * as React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Drop the outer card chrome (border + rounded + padding) so the section
   * can render as a plain content block inside a parent card — used when
   * the FormSection lives inside a tabbed wrapper that already provides
   * the card surface.
   */
  borderless?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className, borderless }) => (
  <section
    className={[
      borderless ? '' : 'border border-border rounded-xl p-6',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <h2 className="text-lg font-semibold mb-6">{title}</h2>
    <div>{children}</div>
  </section>
);