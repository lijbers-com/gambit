'use client';

import { OfflineInstoreSettings } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigSettingsPage() {
  const Component = OfflineInstoreSettings.render as () => React.JSX.Element;
  return <Component />;
}
