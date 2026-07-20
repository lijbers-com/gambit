'use client';

import { MediaPlanDetail } from '@/components/layout/page-templates/media-plan-detail.stories';

export default function MediaPlanDetailPage() {
  const Component = MediaPlanDetail.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Media plan detail</div>;
  }

  return <Component />;
}
