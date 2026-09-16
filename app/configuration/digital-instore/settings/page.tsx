'use client';

import { DigitalInstoreSettings } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigSettingsPage() {
  const Component = DigitalInstoreSettings.render as () => React.JSX.Element;
  return <Component />;
}
