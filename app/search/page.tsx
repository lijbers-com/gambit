'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { SearchResults } from '@/components/layout/page-templates/search-results';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const handleRowClick = (type: string, id: string) => {
    // Navigate to the appropriate detail page based on type
    switch (type) {
      case 'campaign':
        router.push(`/campaigns/display/${id}`);
        break;
      case 'booking':
        router.push(`/calendar/display`);
        break;
      case 'creative':
        router.push(`/creatives`);
        break;
      default:
        console.log('Navigate to:', type, id);
    }
  };

  return (
    <SearchResults
      searchQuery={query}
      onRowClick={handleRowClick}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
