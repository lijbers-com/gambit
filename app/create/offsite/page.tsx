'use client';

import { OffsiteInOption } from '@/components/layout/page-templates/campaign-details.stories';

export default function CreateOffsitePage() {
  const Component = OffsiteInOption.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Campaign</div>;
  }

  return <Component />;
}
