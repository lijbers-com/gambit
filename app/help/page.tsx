'use client';

import { HelpCentre } from '@/components/layout/page-templates/faq-configuration.stories';

export default function HelpPage() {
  const Component = HelpCentre.render as () => React.JSX.Element;
  return Component ? <Component /> : <div>Help</div>;
}
