'use client';

import { Display } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigPage() {
  const Component = Display.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Display Configuration</div>;
  }

  return <Component />;
}
