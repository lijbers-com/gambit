'use client';

import { OffsiteRule } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OffsiteConfigRulePage() {
  const Component = OffsiteRule.render as () => React.JSX.Element;
  return <Component />;
}
