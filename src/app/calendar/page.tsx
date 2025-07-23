'use client';

// Redirect from /calendar to /calendar/sponsored-products (or show a general calendar)
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CalendarPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the first engine-specific calendar
    router.push('/calendar/sponsored-products');
  }, [router]);
  
  return null;
}