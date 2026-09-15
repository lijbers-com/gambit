'use client';

import { Display } from '@/components/layout/page-templates/creative-overview-proposition.stories';

export default function CreativesPage() {
  const Component = Display.render as () => React.JSX.Element;
  return <Component />;
}
