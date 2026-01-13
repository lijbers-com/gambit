'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';

// PostHog context type
interface PostHogContextType {
  posthog: typeof posthog | null;
}

// Create context
const PostHogContext = createContext<PostHogContextType | undefined>(undefined);

// PostHog Provider Component
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Get environment variables
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    // Only initialize if we have the required environment variables
    if (apiKey && apiHost) {
      // Initialize PostHog
      posthog.init(apiKey, {
        api_host: apiHost,
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users

        // Enable all requested features
        autocapture: true, // Auto-capture clicks and pageviews
        capture_pageview: true, // Automatically capture pageviews
        disable_session_recording: false, // Enable session recordings

        // Additional recommended settings for Next.js
        loaded: (posthog) => {
          // Enable debug mode in development
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        },

        // Disable in development if needed (currently enabled for testing)
        // disable_session_recording: process.env.NODE_ENV === 'development',
      });

      console.log('✅ PostHog initialized successfully');
    } else {
      console.warn('⚠️ PostHog not initialized: Missing NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST environment variables');
    }

    // Cleanup function
    return () => {
      // PostHog doesn't need explicit cleanup, but you can add logic here if needed
    };
  }, []);

  return (
    <PostHogContext.Provider value={{ posthog }}>
      {children}
    </PostHogContext.Provider>
  );
}

// Custom hook to use PostHog
export function usePostHog() {
  const context = useContext(PostHogContext);

  if (context === undefined) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }

  return context.posthog;
}

// Export posthog for direct usage
export { posthog };
