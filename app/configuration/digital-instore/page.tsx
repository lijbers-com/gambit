'use client';

import { DigitalInstore } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigPage() {
  const Component = DigitalInstore.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-store Configuration</div>;
  }

  return <Component />;
}
