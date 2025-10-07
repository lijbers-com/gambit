'use client';

import { Display as CreativeDisplay } from '@/components/layout/page-templates/creative-detail.stories';

export default function DisplayCreativeDetailPage() {
  const Component = CreativeDisplay.render || (() => <div>Display Creative Detail</div>);
  return <Component />;
}