'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreateOffsite } from '@/components/layout/page-templates/create-proposition-campaign.stories';

// ?planId= creates the campaign inside that media plan; ?campaignId= enters
// the same wizard at its booking step for an existing campaign; ?bookingId=
// opens an existing prefilled booking to check and approve; and
// &step=creatives runs only the creative step.
function CreateOffsiteContent() {
  const searchParams = useSearchParams();
  const Component = CreateOffsite.render as (args: { planId?: string; campaignId?: string; bookingId?: string; step?: string; returnTo?: string }) => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Campaign</div>;
  }

  return (
    <Component
      planId={searchParams?.get('planId') ?? undefined}
      campaignId={searchParams?.get('campaignId') ?? undefined}
      bookingId={searchParams?.get('bookingId') ?? undefined}
      step={searchParams?.get('step') ?? undefined}
      returnTo={searchParams?.get('returnTo') ?? undefined}
    />
  );
}

export default function CreateOffsitePage() {
  return (
    <Suspense>
      <CreateOffsiteContent />
    </Suspense>
  );
}
