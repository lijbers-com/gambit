import { Suspense } from 'react';
import InsightsReportClient from './client';

export default function InsightsReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InsightsReportClient />
    </Suspense>
  );
}
