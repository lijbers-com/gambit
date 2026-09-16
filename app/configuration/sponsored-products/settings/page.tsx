'use client';

import { SponsoredProductsSettings } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigSettingsPage() {
  const Component = SponsoredProductsSettings.render as () => React.JSX.Element;
  return <Component />;
}
