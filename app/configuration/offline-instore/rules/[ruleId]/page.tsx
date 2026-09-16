'use client';

import { OfflineInstoreRule } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigRulePage() {
  const Component = OfflineInstoreRule.render as () => React.JSX.Element;
  return <Component />;
}
