'use client';

import { DisplayInOption } from '@/components/layout/page-templates/campaign-details.stories';

export default function CreateExtendedReachPage() {
  // Extended Reach uses the Display detail view as a base
  const Component = DisplayInOption.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Extended Reach Campaign</div>;
  }

  return <Component />;
}
