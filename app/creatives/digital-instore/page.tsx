'use client';

import { DigitalInStore } from '@/components/layout/page-templates/creative-overview-proposition.stories';

export default function CreativesPage() {
  const Component = DigitalInStore.render as () => React.JSX.Element;
  return <Component />;
}
