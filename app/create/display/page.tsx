'use client';

import { DisplayInOption } from '@/components/layout/page-templates/campaign-details.stories';

export default function CreateDisplayPage() {
  const Component = DisplayInOption.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Display Campaign</div>;
  }

  return <Component />;
}
