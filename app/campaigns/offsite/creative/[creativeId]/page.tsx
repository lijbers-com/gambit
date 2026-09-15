'use client';

import { Offsite as CreativeOffsite } from '@/components/layout/page-templates/creative-detail.stories';

export default function OffsiteCreativeDetailPage() {
  const Component = CreativeOffsite.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Creative Detail</div>;
  }

  return <Component />;
}
