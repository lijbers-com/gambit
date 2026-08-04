'use client';

import { Overview } from '@/components/layout/page-templates/faq-configuration.stories';

export default function FaqConfigurationPage() {
  const Component = Overview.render as () => React.JSX.Element;

  if (!Component) {
    return <div>FAQ &amp; help</div>;
  }

  return <Component />;
}
