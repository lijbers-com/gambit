'use client';

import { Offsite } from '@/components/layout/page-templates/creative-overview-proposition.stories';

export default function CreativesPage() {
  const Component = Offsite.render as () => React.JSX.Element;
  return <Component />;
}
