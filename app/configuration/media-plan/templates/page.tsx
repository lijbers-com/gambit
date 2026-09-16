'use client';

import { MediaPlanTemplates } from '@/components/layout/page-templates/engine-configuration.stories';

export default function MediaPlanConfigTemplatesPage() {
  const Component = MediaPlanTemplates.render as () => React.JSX.Element;
  return <Component />;
}
