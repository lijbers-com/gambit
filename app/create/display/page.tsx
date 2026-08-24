'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreateDisplay } from '@/components/layout/page-templates/create-proposition-campaign.stories';

// ?planId= creates the campaign inside that media plan; ?campaignId= enters
// the same wizard at its booking step for an existing campaign; ?bookingId=
// opens an existing prefilled booking to check and approve; and
// &step=creatives runs only the creative step.
function CreateDisplayContent() {
  const searchParams = useSearchParams();
  const Component = CreateDisplay.render as (args: { planId?: string; campaignId?: string; bookingId?: string; step?: string }) => React.JSX.Element;

  if (!Component) {
    return <div>Display Campaign</div>;
  }

  return (
    <Component
      planId={searchParams?.get('planId') ?? undefined}
      campaignId={searchParams?.get('campaignId') ?? undefined}
      bookingId={searchParams?.get('bookingId') ?? undefined}
      step={searchParams?.get('step') ?? undefined}
    />
  );
}

export default function CreateDisplayPage() {
  return (
    <Suspense>
      <CreateDisplayContent />
    </Suspense>
  );
}
