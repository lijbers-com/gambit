'use client';

import { RetailMediaPlatform } from '@/components/layout/page-templates/login.stories';

export default function LoginPage() {
  // The login template handles user selection + session itself (src/lib/db).
  const LoginComponent = RetailMediaPlatform.render as () => React.JSX.Element;
  if (!LoginComponent) return <div>Login</div>;
  return <LoginComponent />;
}
