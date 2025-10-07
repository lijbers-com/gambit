'use client';

import { DigitalInstore } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigPage() {
  const Component = DigitalInstore.render || (() => <div>Digital In-store Configuration</div>);
  return <Component />;
}
