'use client';

import { Display as CreativeDisplay } from '@/components/layout/page-templates/creative-detail.stories';
import { DigitalInStore as CreativeDigital } from '@/components/layout/page-templates/creative-detail.stories';
import { OfflineInStore as CreativeOffline } from '@/components/layout/page-templates/creative-detail.stories';
import { useParams } from 'next/navigation';

export default function CreativeDetailPage() {
  const params = useParams();
  const type = params.type as string;

  let Component: (() => React.JSX.Element) | null = null;
  switch (type) {
    case 'display':
      Component = CreativeDisplay.render as () => React.JSX.Element;
      break;
    case 'digital-instore':
      Component = CreativeDigital.render as () => React.JSX.Element;
      break;
    case 'offline-instore':
      Component = CreativeOffline.render as () => React.JSX.Element;
      break;
    default:
      Component = null;
  }

  if (!Component) {
    return <div>Creative Detail</div>;
  }

  return <Component />;
}
