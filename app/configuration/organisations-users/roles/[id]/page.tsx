'use client';
import { RoleDetailCampaignManager } from '@/components/layout/page-templates/role-detail.stories';
import React from 'react';
export default function RoleDetailPage() {
  const Component = RoleDetailCampaignManager.render as () => React.JSX.Element;
  if (!Component) return <div>Role Detail</div>;
  return <Component />;
}
