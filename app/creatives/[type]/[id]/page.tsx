'use client';

import { Display as CreativeDisplay } from '@/components/layout/page-templates/creative-detail.stories';
import { DigitalInStore as CreativeDigital } from '@/components/layout/page-templates/creative-detail.stories';
import { OfflineInStore as CreativeOffline } from '@/components/layout/page-templates/creative-detail.stories';
import { useParams } from 'next/navigation';

export default function CreativeDetailPage() {
  const params = useParams();
  const type = params.type as string;

  let Component;
  switch (type) {
    case 'display':
      Component = CreativeDisplay.render || (() => <div>Display Creative Detail</div>);
      break;
    case 'digital-instore':
      Component = CreativeDigital.render || (() => <div>Digital In-store Creative Detail</div>);
      break;
    case 'offline-instore':
      Component = CreativeOffline.render || (() => <div>Offline In-store Creative Detail</div>);
      break;
    default:
      Component = () => <div>Creative Detail</div>;
  }

  return <Component />;
}
