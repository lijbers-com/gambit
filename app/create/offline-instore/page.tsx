'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreateOfflineInstore } from '@/components/layout/page-templates/create-proposition-campaign.stories';

// ?planId= creates the campaign inside that media plan; ?campaignId= enters
// the same wizard at its booking step for an existing campaign, and
// &step=creatives runs only the creative step.
function CreateOfflineInstoreContent() {
  const searchParams = useSearchParams();
  const Component = CreateOfflineInstore.render as (args: { planId?: string; campaignId?: string; step?: string }) => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-Store Campaign</div>;
  }

  return (
    <Component
      planId={searchParams?.get('planId') ?? undefined}
      campaignId={searchParams?.get('campaignId') ?? undefined}
      step={searchParams?.get('step') ?? undefined}
    />
  );
}

export default function CreateOfflineInstorePage() {
  return (
    <Suspense>
      <CreateOfflineInstoreContent />
    </Suspense>
  );
}
