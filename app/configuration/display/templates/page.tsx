'use client';

import { DisplayTemplates } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigTemplatesPage() {
  const Component = DisplayTemplates.render as () => React.JSX.Element;
  return <Component />;
}
