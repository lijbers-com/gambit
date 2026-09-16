'use client';

import { DisplaySettings } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigSettingsPage() {
  const Component = DisplaySettings.render as () => React.JSX.Element;
  return <Component />;
}
