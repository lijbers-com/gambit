'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SimplifiedSPWizard } from '@/components/layout/page-templates/create-proposition-campaign.stories';

function CreateSponsoredProductsContent() {
  const searchParams = useSearchParams();

  const campaignName = searchParams.get('campaignName') ?? undefined;
  const externalId = searchParams.get('externalId') ?? undefined;
  const budget = searchParams.get('budget') ?? undefined;
  const advertiser = searchParams.get('advertiser') ?? undefined;
  const mediaPlanLabel = searchParams.get('mediaPlanLabel') ?? undefined;
  const startDateRaw = searchParams.get('startDate');
  const endDateRaw = searchParams.get('endDate');

  const initialValues = {
    campaignName,
    externalId,
    budget,
    advertiser,
    mediaPlanLabel,
    startDate: startDateRaw ? new Date(startDateRaw) : undefined,
    endDate: endDateRaw ? new Date(endDateRaw) : undefined,
  };

  return <SimplifiedSPWizard initialValues={initialValues} />;
}

export default function CreateSponsoredProductsPage() {
  return (
    <Suspense>
      <CreateSponsoredProductsContent />
    </Suspense>
  );
}
