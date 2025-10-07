'use client';

import { DigitalInStore as CreativeDigital } from '@/components/layout/page-templates/creative-detail.stories';

export default function DigitalInstoreCreativeDetailPage() {
  const Component = CreativeDigital.render || (() => <div>Digital In-store Creative Detail</div>);
  return <Component />;
}
