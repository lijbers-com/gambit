import * as React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className }) => (
  <section className={['border border-slate-200 rounded-xl p-6', className].filter(Boolean).join(' ')}>
    <h2 className="text-lg font-semibold mb-6">{title}</h2>
    <div>{children}</div>
  </section>
); 