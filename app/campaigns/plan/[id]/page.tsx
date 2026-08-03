'use client';

import { useParams } from 'next/navigation';
import { MediaPlanDetail } from '@/components/layout/page-templates/media-plan-detail.stories';

export default function MediaPlanDetailPage() {
  // Take the id from the route (available on the server render too) and pass it
  // in — reading window.location during render would make the server and the
  // hydrated client disagree about which plan is shown.
  const params = useParams<{ id: string }>();
  const Component = MediaPlanDetail.render as (args: { planId?: string }) => React.JSX.Element;

  if (!Component) {
    return <div>Media plan detail</div>;
  }

  return <Component planId={params?.id} />;
}
