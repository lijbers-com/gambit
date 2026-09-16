'use client';

import { OffsiteSettings } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OffsiteConfigSettingsPage() {
  const Component = OffsiteSettings.render as () => React.JSX.Element;
  return <Component />;
}
