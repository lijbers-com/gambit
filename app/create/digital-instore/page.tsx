'use client';

import { DigitalInstoreInOption } from '@/components/layout/page-templates/campaign-details.stories';

export default function CreateDigitalInstorePage() {
  const Component = DigitalInstoreInOption.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-Store Campaign</div>;
  }

  return <Component />;
}
