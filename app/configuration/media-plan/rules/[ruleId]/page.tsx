'use client';

import { MediaPlanRule } from '@/components/layout/page-templates/engine-configuration.stories';

export default function MediaPlanConfigRulePage() {
  const Component = MediaPlanRule.render as () => React.JSX.Element;
  return <Component />;
}
