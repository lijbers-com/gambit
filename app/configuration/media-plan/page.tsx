'use client';

import { MediaPlan } from '@/components/layout/page-templates/engine-configuration.stories';

export default function MediaPlanConfigPage() {
  const Component = MediaPlan.render as () => React.JSX.Element;
  return <Component />;
}
