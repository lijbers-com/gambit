'use client';

import { DisplayRule } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigRulePage() {
  const Component = DisplayRule.render as () => React.JSX.Element;
  return <Component />;
}
