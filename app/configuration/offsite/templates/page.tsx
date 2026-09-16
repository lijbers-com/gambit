'use client';

import { OffsiteTemplates } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OffsiteConfigTemplatesPage() {
  const Component = OffsiteTemplates.render as () => React.JSX.Element;
  return <Component />;
}
