'use client';

import { DigitalInstoreRule } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigRulePage() {
  const Component = DigitalInstoreRule.render as () => React.JSX.Element;
  return <Component />;
}
