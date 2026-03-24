'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreativesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/creatives/display');
  }, [router]);

  return null;
}
