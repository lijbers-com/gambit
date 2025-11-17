'use client';

import { RetailMediaPlatform } from '@/components/layout/page-templates/login.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  // Override the login handler to navigate to campaigns overview
  useEffect(() => {
    // Intercept form submissions and button clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if it's a login button click
      if (target.tagName === 'BUTTON' && target.textContent?.includes('Sign in')) {
        e.preventDefault();
        router.push('/campaigns');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [router]);

  // Get the render function from the story
  const LoginComponent = RetailMediaPlatform.render as () => React.JSX.Element;

  if (!LoginComponent) {
    return <div>Login Component</div>;
  }

  return <LoginComponent />;
}