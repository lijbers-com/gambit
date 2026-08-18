import type { Metadata } from 'next';
import { EdgeOsLanding } from '@/components/layout/page-templates/edge-os-landing.stories';

export const metadata: Metadata = {
  title: 'edge.os — Retail media, end to end',
  description:
    'edge.os helps retailers and brands activate shopper audiences, launch targeted campaigns, and measure performance across the full retail media journey.',
};

export default function ProductPage() {
  return <EdgeOsLanding />;
}
