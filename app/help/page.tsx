'use client';

import { Overview } from '@/components/layout/page-templates/faq-configuration.stories';

export default function HelpPage() {
  const Component = Overview.render as () => React.JSX.Element;
  return Component ? <Component /> : <div>Help &amp; content</div>;
}
