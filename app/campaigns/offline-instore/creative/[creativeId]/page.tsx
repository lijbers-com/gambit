'use client';

import { OfflineInStore as CreativeOffline } from '@/components/layout/page-templates/creative-detail.stories';

export default function OfflineInstoreCreativeDetailPage() {
  const Component = CreativeOffline.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-store Creative Detail</div>;
  }

  return <Component />;
}
