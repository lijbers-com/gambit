'use client';

// EXACT Dashboard component from story/page-templates-dashboard--dashboard
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { defaultRoutes } from '@/components/layout/default-routes';

export default function DashboardPage() {
  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Offline media in-store',
        subtitle: 'Manage your offline media campaigns and performance',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
      }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Page Content Area</CardTitle>
          <CardDescription>
            This is where your page content will go.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Content area ready for your components */}
        </CardContent>
      </Card>
    </AppLayout>
  );
}