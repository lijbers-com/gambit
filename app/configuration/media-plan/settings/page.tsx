'use client';

import { MediaPlanSettings } from '@/components/layout/page-templates/engine-configuration.stories';

export default function MediaPlanConfigSettingsPage() {
  const Component = MediaPlanSettings.render as () => React.JSX.Element;
  return <Component />;
}
