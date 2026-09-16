'use client';

import { OfflineInstoreTemplates } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigTemplatesPage() {
  const Component = OfflineInstoreTemplates.render as () => React.JSX.Element;
  return <Component />;
}
