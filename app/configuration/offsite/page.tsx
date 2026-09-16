'use client';

import { Offsite } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OffsiteConfigPage() {
  const Component = Offsite.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Configuration</div>;
  }

  return <Component />;
}
