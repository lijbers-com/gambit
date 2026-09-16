'use client';

import { DigitalInstoreTemplates } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigTemplatesPage() {
  const Component = DigitalInstoreTemplates.render as () => React.JSX.Element;
  return <Component />;
}
