'use client';

import { DigitalInStore as CreativeDigital } from '@/components/layout/page-templates/creative-detail.stories';

export default function DigitalInstoreCreativeDetailPage() {
  const Component = CreativeDigital.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-store Creative Detail</div>;
  }

  return <Component />;
}
